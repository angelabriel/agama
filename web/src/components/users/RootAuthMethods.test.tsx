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
import { screen } from "@testing-library/react";
import { plainRender } from "~/test-utils";
import { RootAuthMethods } from "~/components/users";
import { USER } from "~/routes/paths";

let mockPassword: boolean;
let mockSSHKey: string;

jest.mock("~/queries/users", () => ({
  ...jest.requireActual("~/queries/users"),
  useRootUser: () => ({ password: mockPassword, sshkey: mockSSHKey }),
  useRootUserChanges: () => jest.fn(),
}));

const testKey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDM+ test@example";

beforeEach(() => {
  mockPassword = false;
  mockSSHKey = "";
});

describe("RootAuthMethods", () => {
  it("renders an edit action", () => {
    plainRender(<RootAuthMethods />);

    const editLink = screen.getByRole("link", { name: "Edit" });
    expect(editLink).toHaveAttribute("href", USER.rootUser.edit);
  });

  describe("if no method is defined", () => {
    it("renders them as 'Not defined'", () => {
      plainRender(<RootAuthMethods />);

      expect(screen.getAllByText("Not defined").length).toEqual(2);
    });
  });

  describe("when password has been defined", () => {
    beforeEach(() => {
      mockPassword = true;
    });

    it("renders the 'Defined (hidden)' text", async () => {
      plainRender(<RootAuthMethods />);

      screen.getByText("Defined (hidden)");
    });
  });

  describe("when SSH Key has been defined", () => {
    beforeEach(() => {
      mockSSHKey = testKey;
    });

    it("renders its truncated content keeping the comment visible when possible", async () => {
      plainRender(<RootAuthMethods />);

      screen.getByText("ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDM+");
      screen.getByText("test@example");
    });
  });
});
