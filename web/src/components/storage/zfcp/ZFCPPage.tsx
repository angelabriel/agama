/*
 * Copyright (c) [2023-2025] SUSE LLC
 *
 * All Rights Reserved.
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; either version 2 of the License, or (at your option)
 * any later version.
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
 * find current contact information at www.suse.com.
 */

import React from "react";
import {
  Button,
  Content,
  Grid,
  GridItem,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { EmptyState, Page } from "~/components/core";
import { _ } from "~/i18n";
import {
  useZFCPConfig,
  useZFCPControllers,
  useZFCPControllersChanges,
  useZFCPDisks,
  useZFCPDisksChanges,
} from "~/queries/storage/zfcp";
import ZFCPDisksTable from "./ZFCPDisksTable";
import ZFCPControllersTable from "./ZFCPControllersTable";
import { probeZFCP } from "~/api/storage/zfcp";
import { STORAGE as PATHS } from "~/routes/paths";
import { useNavigate } from "react-router-dom";
import { inactiveLuns } from "~/utils/zfcp";

const LUNScanInfo = () => {
  const { allowLunScan } = useZFCPConfig();
  // TRANSLATORS: the text in the square brackets [] will be displayed in bold
  const lunScanEnabled = _(
    "Automatic LUN scan is [enabled]. Activating a controller which is \
      running in NPIV mode will automatically configures all its LUNs.",
  );
  // TRANSLATORS: the text in the square brackets [] will be displayed in bold
  const lunScanDisabled = _(
    "Automatic LUN scan is [disabled]. LUNs have to be manually \
      configured after activating a controller.",
  );

  const msg = allowLunScan ? lunScanEnabled : lunScanDisabled;
  const [msgStart, msgBold, msgEnd] = msg.split(/[[\]]/);

  return (
    <p>
      {msgStart}
      <b>{msgBold}</b>
      {msgEnd}
    </p>
  );
};

const NoDisksFound = () => {
  const navigate = useNavigate();
  const controllers = useZFCPControllers();
  const activeController = controllers.some((c) => c.active);
  const body = activeController
    ? _("Please, try to activate a zFCP disk.")
    : _("Please, try to activate a zFCP controller.");

  return (
    <EmptyState
      title={_("No zFCP disks found.")}
      icon="warning"
      variant="sm"
      actions={
        activeController && (
          <Button variant="primary" onClick={() => navigate(PATHS.zfcp.activateDisk)}>
            {_("Activate zFCP disk")}
          </Button>
        )
      }
    >
      {body}
    </EmptyState>
  );
};

const Disks = () => {
  const navigate = useNavigate();
  const disks = useZFCPDisks();
  const controllers = useZFCPControllers();
  const isDisabled = inactiveLuns(controllers, disks).length === 0;

  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem align={{ default: "alignEnd" }}>
            {/* TRANSLATORS: button label */}
            <Button onClick={() => navigate(PATHS.zfcp.activateDisk)} isDisabled={isDisabled}>
              {_("Activate new disk")}
            </Button>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>

      <ZFCPDisksTable />
    </>
  );
};

/**
 * Section for zFCP disks.
 */
const DisksSection = () => {
  const disks = useZFCPDisks();

  return (
    <Page.Section title={_("Disks")}>
      {disks.length === 0 ? <NoDisksFound /> : <Disks />}
    </Page.Section>
  );
};

/**
 * Section for zFCP controllers.
 */
const ControllersSection = () => (
  <Page.Section title={_("Controllers")}>
    <LUNScanInfo />
    <ZFCPControllersTable />
  </Page.Section>
);

const PageContent = () => {
  const controllers = useZFCPControllers();

  if (controllers.length === 0) {
    return (
      <EmptyState
        headingLevel="h3"
        title={_("No zFCP controllers found.")}
        icon="error"
        actions={
          <Button variant="primary" onClick={probeZFCP}>
            {_("Read zFCP devices")}
          </Button>
        }
      >
        <div>{_("Please, try to activate a zFCP controller.")}</div>
      </EmptyState>
    );
  }

  return (
    <Grid hasGutter>
      <GridItem sm={12} xl={6}>
        <ControllersSection />
      </GridItem>
      <GridItem sm={12} xl={6}>
        <DisksSection />
      </GridItem>
    </Grid>
  );
};

/**
 * Page for managing zFCP devices.
 */
export default function ZFCPPage() {
  useZFCPControllersChanges();
  useZFCPDisksChanges();

  return (
    <Page>
      <Page.Header>
        <Content component="h2">{_("zFCP")}</Content>
      </Page.Header>

      <Page.Content>
        <PageContent />
      </Page.Content>

      <Page.Actions>
        <Page.Action variant="secondary" navigateTo={PATHS.root}>
          {_("Back")}
        </Page.Action>
      </Page.Actions>
    </Page>
  );
}
