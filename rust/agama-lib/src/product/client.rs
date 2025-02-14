// Copyright (c) [2024-2025] SUSE LLC
//
// All Rights Reserved.
//
// This program is free software; you can redistribute it and/or modify it
// under the terms of the GNU General Public License as published by the Free
// Software Foundation; either version 2 of the License, or (at your option)
// any later version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
// more details.
//
// You should have received a copy of the GNU General Public License along
// with this program; if not, contact SUSE LLC.
//
// To contact SUSE LLC about this file by physical or electronic mail, you may
// find current contact information at www.suse.com.

use std::collections::HashMap;

use crate::dbus::{get_optional_property, get_property};
use crate::error::ServiceError;
use crate::software::proxies::SoftwareProductProxy;
use serde::Serialize;
use zbus::Connection;

use super::proxies::RegistrationProxy;

/// Represents a software product
#[derive(Default, Debug, Serialize, utoipa::ToSchema)]
#[serde(rename_all = "camelCase")]
pub struct Product {
    /// Product ID (eg., "ALP", "Tumbleweed", etc.)
    pub id: String,
    /// Product name (e.g., "openSUSE Tumbleweed")
    pub name: String,
    /// Product description
    pub description: String,
    /// Product icon (e.g., "default.svg")
    pub icon: String,
    /// Registration requirement
    pub registration: bool,
    /// License ID
    pub license: Option<String>,
}

/// D-Bus client for the software service
#[derive(Clone)]
pub struct ProductClient<'a> {
    product_proxy: SoftwareProductProxy<'a>,
    registration_proxy: RegistrationProxy<'a>,
}

impl<'a> ProductClient<'a> {
    pub async fn new(connection: Connection) -> Result<ProductClient<'a>, ServiceError> {
        Ok(Self {
            product_proxy: SoftwareProductProxy::new(&connection).await?,
            registration_proxy: RegistrationProxy::new(&connection).await?,
        })
    }

    /// Returns the available products
    pub async fn products(&self) -> Result<Vec<Product>, ServiceError> {
        let products: Vec<Product> = self
            .product_proxy
            .available_products()
            .await?
            .into_iter()
            .map(|(id, name, data)| {
                let description = match data.get("description") {
                    Some(value) => value.try_into().unwrap(),
                    None => "",
                };
                let icon = match data.get("icon") {
                    Some(value) => value.try_into().unwrap(),
                    None => "default.svg",
                };

                let registration = get_property::<bool>(&data, "registration").unwrap_or(false);

                let license = get_optional_property::<String>(&data, "license").unwrap_or_default();

                Product {
                    id,
                    name,
                    description: description.to_string(),
                    icon: icon.to_string(),
                    registration,
                    license,
                }
            })
            .collect();
        Ok(products)
    }

    /// Returns the id of the selected product to install
    pub async fn product(&self) -> Result<String, ServiceError> {
        Ok(self.product_proxy.selected_product().await?)
    }

    /// Selects the product to install
    pub async fn select_product(&self, product_id: &str) -> Result<(), ServiceError> {
        let result = self.product_proxy.select_product(product_id).await?;

        match result {
            (0, _) => Ok(()),
            (3, description) => {
                let products = self.products().await?;
                let ids: Vec<String> = products.into_iter().map(|p| p.id).collect();
                let error = format!("{0}. Available products: '{1:?}'", description, ids);
                Err(ServiceError::UnsuccessfulAction(error))
            }
            (_, description) => Err(ServiceError::UnsuccessfulAction(description)),
        }
    }

    /// registration code used to register product
    pub async fn registration_code(&self) -> Result<String, ServiceError> {
        Ok(self.registration_proxy.reg_code().await?)
    }

    /// email used to register product
    pub async fn email(&self) -> Result<String, ServiceError> {
        Ok(self.registration_proxy.email().await?)
    }

    /// register product
    pub async fn register(&self, code: &str, email: &str) -> Result<(u32, String), ServiceError> {
        let mut options: HashMap<&str, &zbus::zvariant::Value> = HashMap::new();
        let value = zbus::zvariant::Value::from(email);
        if !email.is_empty() {
            options.insert("Email", &value);
        }
        Ok(self.registration_proxy.register(code, options).await?)
    }

    /// de-register product
    pub async fn deregister(&self) -> Result<(u32, String), ServiceError> {
        Ok(self.registration_proxy.deregister().await?)
    }
}
