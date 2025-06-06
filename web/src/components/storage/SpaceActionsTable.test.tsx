/*
 * Copyright (c) [2024] SUSE LLC
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

// @ts-check

import React from "react";
import { screen, within } from "@testing-library/react";
import { deviceChildren, gib } from "~/components/storage/utils";
import { plainRender } from "~/test-utils";
import SpaceActionsTable, { SpaceActionsTableProps } from "~/components/storage/SpaceActionsTable";
import { StorageDevice } from "~/types/storage";
import { apiModel } from "~/api/storage/types";

const sda: StorageDevice = {
  sid: 59,
  isDrive: true,
  type: "disk",
  description: "",
  vendor: "Micron",
  model: "Micron 1100 SATA",
  driver: ["ahci", "mmcblk"],
  bus: "IDE",
  busId: "",
  transport: "usb",
  dellBOSS: false,
  sdCard: true,
  active: true,
  name: "/dev/sda",
  size: gib(10),
  shrinking: { unsupported: ["Resizing is not supported"] },
  systems: [],
  udevIds: ["ata-Micron_1100_SATA_512GB_12563", "scsi-0ATA_Micron_1100_SATA_512GB"],
  udevPaths: ["pci-0000:00-12", "pci-0000:00-12-ata"],
};

const sda1: StorageDevice = {
  sid: 69,
  name: "/dev/sda1",
  description: "Swap partition",
  isDrive: false,
  type: "partition",
  size: gib(2),
  shrinking: { unsupported: ["Resizing is not supported"] },
  start: 1,
};

const sda2: StorageDevice = {
  sid: 79,
  name: "/dev/sda2",
  description: "EXT4 partition",
  isDrive: false,
  type: "partition",
  size: gib(6),
  shrinking: { supported: gib(3) },
  start: 2,
};

sda.partitionTable = {
  type: "gpt",
  partitions: [sda1, sda2],
  unpartitionedSize: 0,
  unusedSlots: [{ start: 3, size: gib(2) }],
};

const mockDrive: apiModel.Drive = {
  name: "/dev/sda",
  partitions: [
    {
      name: "/dev/sda2",
      mountPath: "swap",
      filesystem: { reuse: false, default: true },
    },
  ],
};

const mockUseConfigModelFn = jest.fn();
jest.mock("~/queries/storage/config-model", () => ({
  useConfigModel: () => mockUseConfigModelFn(),
}));

/**
 * Function to ask for the action of a device.
 *
 * @param {StorageDevice} device
 * @returns {string}
 */
const deviceAction = (device) => {
  if (device === sda1) return "keep";

  return "delete";
};

let props: SpaceActionsTableProps;

describe("SpaceActionsTable", () => {
  beforeEach(() => {
    props = {
      devices: deviceChildren(sda),
      deviceAction,
      onActionChange: jest.fn(),
    };

    mockUseConfigModelFn.mockReturnValue({ drives: [] });
  });

  it("shows the devices to configure the space actions", () => {
    plainRender(<SpaceActionsTable {...props} />);

    screen.getByRole("row", {
      name: "sda1 Swap partition 2 GiB Do not modify Allow shrink Delete",
    });
    screen.getByRole("row", {
      name: "sda2 EXT4 partition 6 GiB Do not modify Allow shrink Delete",
    });
    screen.getByRole("row", { name: "Unused space 2 GiB" });
  });

  it("selects the action for each device", () => {
    plainRender(<SpaceActionsTable {...props} />);

    const sda1Row = screen.getByRole("row", { name: /sda1/ });
    within(sda1Row).getByRole("button", { name: "Do not modify", pressed: true });
    within(sda1Row).getByRole("button", { name: "Allow shrink", pressed: false });
    within(sda1Row).getByRole("button", { name: "Delete", pressed: false });

    const sda2Row = screen.getByRole("row", { name: /sda2/ });
    within(sda2Row).getByRole("button", { name: "Do not modify", pressed: false });
    within(sda2Row).getByRole("button", { name: "Allow shrink", pressed: false });
    within(sda2Row).getByRole("button", { name: "Delete", pressed: true });
  });

  it("disables shrink action if it is not supported", () => {
    plainRender(<SpaceActionsTable {...props} />);

    const sda1Row = screen.getByRole("row", { name: /sda1/ });
    const sda1ShrinkButton = within(sda1Row).getByRole("button", { name: "Allow shrink" });
    expect(sda1ShrinkButton).toBeDisabled();

    const sda2Row = screen.getByRole("row", { name: /sda2/ });
    const sda2ShrinkButton = within(sda2Row).getByRole("button", { name: "Allow shrink" });
    expect(sda2ShrinkButton).not.toBeDisabled();
  });

  describe("if a partition is going to be used", () => {
    beforeEach(() => {
      mockUseConfigModelFn.mockReturnValue({ drives: [mockDrive] });
    });

    it("disables shrink and delete actions for the partition", () => {
      plainRender(<SpaceActionsTable {...props} />);

      const sda2Row = screen.getByRole("row", { name: /sda2/ });
      const sda2ShrinkButton = within(sda2Row).getByRole("button", { name: "Allow shrink" });
      const sda2DeleteButton = within(sda2Row).getByRole("button", { name: "Delete" });
      expect(sda2ShrinkButton).toBeDisabled();
      expect(sda2DeleteButton).toBeDisabled();
    });
  });

  it("allows to change the action", async () => {
    const { user } = plainRender(<SpaceActionsTable {...props} />);

    const sda1Row = screen.getByRole("row", { name: /sda1/ });
    const sda1DeleteButton = within(sda1Row).getByRole("button", { name: "Delete" });
    await user.click(sda1DeleteButton);

    expect(props.onActionChange).toHaveBeenCalledWith({
      deviceName: "/dev/sda1",
      value: "delete",
    });
  });

  it("allows to show information about the device", async () => {
    const { user } = plainRender(<SpaceActionsTable {...props} />);

    const sda1Row = screen.getByRole("row", { name: /sda1/ });
    const sda1InfoButton = within(sda1Row).getByRole("button", {
      name: /information about .*sda1/,
    });
    await user.click(sda1InfoButton);
    const sda1Popup = screen.getByRole("dialog");
    within(sda1Popup).getByText(/Resizing is not supported/);

    const sda2Row = screen.getByRole("row", { name: /sda2/ });
    const sda2InfoButton = within(sda2Row).getByRole("button", {
      name: /information about .*sda2/,
    });
    await user.click(sda2InfoButton);
    const sda2Popup = await screen.findByRole("dialog");
    within(sda2Popup).getByText(/Up to 3 GiB/);
  });
});
