/*
 * Copyright (c) [2025] SUSE LLC
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
import { useNavigate, generatePath } from "react-router-dom";
import { _ } from "~/i18n";
import { STORAGE as PATHS } from "~/routes/paths";
import { apiModel } from "~/api/storage/types";
import { model } from "~/types/storage";
import { contentDescription } from "~/components/storage/utils/volume-group";
import { useVolumeGroup } from "~/hooks/storage/model";
import useDeleteVolumeGroup from "~/hooks/storage/delete-volume-group";
import DeviceMenu from "~/components/storage/DeviceMenu";
import DeviceHeader from "~/components/storage/DeviceHeader";
import MountPathMenuItem from "~/components/storage/MountPathMenuItem";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Flex,
  MenuItem,
  MenuList,
} from "@patternfly/react-core";

import spacingStyles from "@patternfly/react-styles/css/utilities/Spacing/spacing";

const DeleteVgOption = ({ vg }: { vg: model.VolumeGroup }) => {
  const deleteVolumeGroup = useDeleteVolumeGroup();

  return (
    <MenuItem
      key="delete-volume-group"
      itemId="delete-volume-group"
      isDanger
      description={_("Delete the volume group and its logical volumes")}
      role="menuitem"
      onClick={() => deleteVolumeGroup(vg.vgName)}
    >
      <span>{_("Delete volume group")}</span>
    </MenuItem>
  );
};

const EditVgOption = ({ vg }: { vg: model.VolumeGroup }) => {
  const navigate = useNavigate();

  return (
    <MenuItem
      key="edit-volume-group"
      itemId="edit-volume-group"
      description={_("Modify settings and physical volumes")}
      role="menuitem"
      onClick={() => navigate(generatePath(PATHS.volumeGroup.edit, { id: vg.vgName }))}
    >
      <span>{_("Edit volume group")}</span>
    </MenuItem>
  );
};

const VgMenu = ({ vg }: { vg: model.VolumeGroup }) => {
  return (
    <DeviceMenu title={<b aria-hidden>{vg.vgName}</b>}>
      <MenuList>
        <EditVgOption vg={vg} />
        <DeleteVgOption vg={vg} />
      </MenuList>
    </DeviceMenu>
  );
};

const VgHeader = ({ vg }: { vg: model.VolumeGroup }) => {
  const title = vg.logicalVolumes.length
    ? _("Create LVM volume group %s")
    : _("Empty LVM volume group %s");

  return (
    <DeviceHeader title={title}>
      <VgMenu vg={vg} />
    </DeviceHeader>
  );
};

const LogicalVolumes = ({ vg }: { vg: model.VolumeGroup }) => {
  return (
    <DeviceMenu
      title={<span aria-hidden>{contentDescription(vg)}</span>}
      ariaLabel={_("Logical volumes")}
    >
      <MenuList>
        {vg.logicalVolumes.map((lv) => {
          return <MountPathMenuItem key={lv.mountPath} device={lv} />;
        })}
      </MenuList>
    </DeviceMenu>
  );
};

export type VolumeGroupEditorProps = { vg: apiModel.VolumeGroup };

export default function VolumeGroupEditor({ vg }: VolumeGroupEditorProps) {
  const volumeGroup = useVolumeGroup(vg.vgName);

  return (
    <Card isCompact>
      <CardHeader>
        <CardTitle>
          <VgHeader vg={volumeGroup} />
        </CardTitle>
      </CardHeader>
      <CardBody className={spacingStyles.plLg}>
        <Flex direction={{ default: "column" }}>
          <LogicalVolumes vg={volumeGroup} />
        </Flex>
      </CardBody>
    </Card>
  );
}
