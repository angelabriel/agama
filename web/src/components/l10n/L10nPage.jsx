/*
 * Copyright (c) [2022-2023] SUSE LLC
 *
 * All Rights Reserved.
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of version 2 of the GNU General Public License as published
 * by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, contact SUSE LLC.
 *
 * To contact SUSE LLC about this file by physical or electronic mail, you may
 * find language contact information at www.suse.com.
 */

import React from "react";
import {
  Gallery, GalleryItem,
} from "@patternfly/react-core";
import { ButtonLink, CardField, Page } from "~/components/core";
import { _ } from "~/i18n";
import { useQuery } from "@tanstack/react-query";
import {
  configQuery,
  localesQuery,
  keymapsQuery,
  timezonesQuery,
  useL10nConfigChanges
} from "~/queries/l10n";

const Section = ({ label, value, children }) => {
  return (
    <CardField
      label={label}
      value={value}
    >
      <CardField.Content>
        {children}
      </CardField.Content>
    </CardField>
  );
};

// FIXME: re-evaluate the need of "Thing not selected yet"
/**
 * Page for configuring localization.
 * @component
 */
export default function L10nPage() {
  useL10nConfigChanges();

  const { isPending: localesPending, data: locales } = useQuery(localesQuery());
  const { isPending: timezonesPending, data: timezones } = useQuery(timezonesQuery());
  const { isPending: keymapsPending, data: keymaps } = useQuery(keymapsQuery());
  const { isPending: configPending, data: config } = useQuery(configQuery());

  if (localesPending || timezonesPending || keymapsPending || configPending) {
    return;
  }

  const { locales: [localeId], keymap: keymapId, timezone: timezoneId } = config;

  const locale = locales.find((l) => l.id === localeId);
  const keymap = keymaps.find((k) => k.id === keymapId);
  const timezone = timezones.find((t) => t.id === timezoneId);

  return (
    <>
      <Page.Header>
        <h2>{_("Localization")}</h2>
      </Page.Header>

      <Page.MainContent>
        <Gallery hasGutter minWidths={{ default: "300px" }}>
          <GalleryItem>
            <Section
              label={_("Language")}
              value={locale ? `${locale.name} - ${locale.territory}` : _("Not selected yet")}
            >
              <ButtonLink to="language/select" isPrimary={!locale}>
                {locale ? _("Change") : _("Select")}
              </ButtonLink>
            </Section>
          </GalleryItem>

          <GalleryItem>
            <Section
              label={_("Keyboard")}
              value={keymap ? keymap.name : _("Not selected yet")}
            >
              <ButtonLink to="keymap/select" isPrimary={!keymap}>
                {keymap ? _("Change") : _("Select")}
              </ButtonLink>
            </Section>
          </GalleryItem>

          <GalleryItem>
            <Section
              label={_("Time zone")}
              value={timezone ? (timezone.parts || []).join(' - ') : _("Not selected yet")}
            >
              <ButtonLink to="timezone/select" isPrimary={!timezone}>
                {timezone ? _("Change") : _("Select")}
              </ButtonLink>
            </Section>
          </GalleryItem>
        </Gallery>
      </Page.MainContent>
    </>
  );
}
