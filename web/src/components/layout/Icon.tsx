/*
 * Copyright (c) [2022-2025] SUSE LLC
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

// NOTE: "@icons" is an alias to use a shorter path to real @material-symbols
// icons location. Check the tsconfig.json file to see its value.
import Apps from "@icons/apps.svg?component";
import AppRegistration from "@icons/app_registration.svg?component";
import Backspace from "@icons/backspace.svg?component";
import CheckCircle from "@icons/check_circle.svg?component";
import Delete from "@icons/delete.svg?component";
import EditSquare from "@icons/edit_square.svg?component";
import Error from "@icons/error.svg?component";
import ErrorFill from "@icons/error-fill.svg?component";
import ExpandCircleDown from "@icons/expand_circle_down.svg?component";
import Fingerprint from "@icons/fingerprint.svg?component";
import KeyboardArrowDown from "@icons/keyboard_arrow_down.svg?component";
import Globe from "@icons/globe.svg?component";
import HardDrive from "@icons/hard_drive.svg?component";
import Info from "@icons/info.svg?component";
import ListAlt from "@icons/list_alt.svg?component";
import Lock from "@icons/lock.svg?component";
import ManageAccounts from "@icons/manage_accounts.svg?component";
import Menu from "@icons/menu.svg?component";
import MoreVert from "@icons/more_vert.svg?component";
import SettingsEthernet from "@icons/settings_ethernet.svg?component";
import SignalCellularAlt from "@icons/signal_cellular_alt.svg?component";
import Warning from "@icons/warning.svg?component";
import Visibility from "@icons/visibility.svg?component";
import VisibilityOff from "@icons/visibility_off.svg?component";
import Wifi from "@icons/wifi.svg?component";
import WifiOff from "@icons/wifi_off.svg?component";

const icons = {
  apps: Apps,
  app_registration: AppRegistration,
  backspace: Backspace,
  check_circle: CheckCircle,
  delete: Delete,
  edit_square: EditSquare,
  error: Error,
  error_fill: ErrorFill,
  expand_circle_down: ExpandCircleDown,
  fingerprint: Fingerprint,
  globe: Globe,
  hard_drive: HardDrive,
  info: Info,
  keyboard_arrow_down: KeyboardArrowDown,
  list_alt: ListAlt,
  lock: Lock,
  manage_accounts: ManageAccounts,
  menu: Menu,
  more_vert: MoreVert,
  settings_ethernet: SettingsEthernet,
  signal_cellular_alt: SignalCellularAlt,
  visibility: Visibility,
  visibility_off: VisibilityOff,
  warning: Warning,
  wifi: Wifi,
  wifi_off: WifiOff,
};

export type IconProps = React.SVGAttributes<SVGElement> & {
  /** Name of the desired icon */
  name: keyof typeof icons;
};

/**
 * Agama Icon component
 *
 * @todo: import icons dynamically if the list grows too much. See
 *   - https://stackoverflow.com/a/61472427
 *   - https://ryanhutzley.medium.com/dynamic-svg-imports-in-create-react-app-d6d411f6d6c6
 *
 * @example
 *   <Icon name="warning" />
 *
 * @returns null if requested icon is not available or given a falsy value as name; JSX block otherwise.
 */
export default function Icon({ name, ...otherProps }: IconProps): JSX.Element | null {
  // NOTE: Reaching this is unlikely, but let's be safe.
  if (!name || !icons[name]) {
    console.error(`Icon '${name}' not found.`);
    return null;
  }

  const IconComponent = icons[name];

  return <IconComponent aria-hidden="true" data-icon-name={name} {...otherProps} />;
}
