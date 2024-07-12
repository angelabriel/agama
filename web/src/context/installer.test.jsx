/*
 * Copyright (c) [2023] SUSE LLC
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
 * find current contact information at www.suse.com.
 */

import React from "react";
import { act, screen } from "@testing-library/react";
import { createDefaultClient } from "~/client";
import { plainRender, createCallbackMock } from "~/test-utils";
import { InstallerClientProvider, useInstallerClientStatus } from "./installer";
import { STARTUP } from "~/client/phase";
import { BUSY } from "~/client/status";

jest.mock("~/client");

// Helper component to check the client status.
const ClientStatus = () => {
  const { connected, phase, status } = useInstallerClientStatus();

  return (
    <ul>
      <li>{`connected: ${connected}`}</li>
      <li>{`phase: ${phase}`}</li>
      <li>{`status: ${status}`}</li>
    </ul>
  );
};

describe("installer context", () => {
  beforeEach(() => {
    createDefaultClient.mockImplementation(() => {
      return {
        onConnect: jest.fn(),
        onDisconnect: jest.fn(),
        manager: {
          getPhase: jest.fn().mockResolvedValue(STARTUP),
          getStatus: jest.fn().mockResolvedValue(BUSY),
          onPhaseChange: jest.fn(),
          onStatusChange: jest.fn(),
        },
      };
    });
  });

  it("reports the status through the useInstallerClientStatus hook", async () => {
    plainRender(
      <InstallerClientProvider>
        <ClientStatus />
      </InstallerClientProvider>,
    );
    await screen.findByText("connected: false");
    await screen.findByText("phase: 0");
    await screen.findByText("status: 1");
  });
});
