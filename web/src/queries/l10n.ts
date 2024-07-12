/*
 * Copyright (c) [2024] SUSE LLC
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
import { useQueryClient, useMutation, useSuspenseQueries } from "@tanstack/react-query";
import { useInstallerClient } from "~/context/installer";
import { timezoneUTCOffset } from "~/utils";

/**
 * Returns a query for retrieving the localization configuration
 */
const configQuery = () => {
  return {
    queryKey: ["l10n/config"],
    queryFn: () => fetch("/api/l10n/config").then((res) => res.json()),
  };
};

/**
 * Returns a query for retrieving the list of known locales
 */
const localesQuery = () => ({
  queryKey: ["l10n/locales"],
  queryFn: async (): Promise<Locale[]> => {
    const response = await fetch("/api/l10n/locales");
    const locales = await response.json();
    return locales.map(({ id, language, territory }): Locale => {
      return { id, name: language, territory };
    });
  },
  staleTime: Infinity,
});

/**
 * Returns a query for retrieving the list of known timezones
 */
const timezonesQuery = () => ({
  queryKey: ["l10n/timezones"],
  queryFn: async (): Promise<Timezone[]> => {
    const response = await fetch("/api/l10n/timezones");
    const timezones = await response.json();
    return timezones.map(({ code, parts, country }): Timezone => {
      const offset = timezoneUTCOffset(code);
      return { id: code, parts, country, utcOffset: offset };
    });
  },
  staleTime: Infinity,
});

/**
 * Returns a query for retrieving the list of known keymaps
 */
const keymapsQuery = () => ({
  queryKey: ["l10n/keymaps"],
  queryFn: async (): Promise<Keymap[]> => {
    const response = await fetch("/api/l10n/keymaps");
    const json = await response.json();
    const keymaps = json.map(({ id, description }): Keymap => {
      return { id, name: description };
    });
    return keymaps.sort((a, b) => (a.name < b.name ? -1 : 1));
  },
  staleTime: Infinity,
});

/**
 * Hook that builds a mutation to update the l10n configuration
 *
 * It does not require to call `useMutation`.
 */
const useConfigMutation = () => {
  const query = {
    mutationFn: (newConfig) =>
      fetch("/api/l10n/config", {
        method: "PATCH",
        body: JSON.stringify(newConfig),
        headers: {
          "Content-Type": "application/json",
        },
      }),
  };
  return useMutation(query);
};

/**
 * Hook that returns a useEffect to listen for L10nConfigChanged events
 *
 * When the configuration changes, it invalidates the config query and forces the router to
 * revalidate its data (executing the loaders again).
 */
const useL10nConfigChanges = () => {
  const queryClient = useQueryClient();
  const client = useInstallerClient();

  React.useEffect(() => {
    if (!client) return;

    return client.ws().onEvent((event) => {
      if (event.type === "L10nConfigChanged") {
        queryClient.invalidateQueries({ queryKey: ["l10n/config"] });
      }
    });
  }, [client, queryClient]);
};

/// Returns the l10n data.
const useL10n = () => {
  const [{ data: config }, { data: locales }, { data: keymaps }, { data: timezones }] =
    useSuspenseQueries({
      queries: [configQuery(), localesQuery(), keymapsQuery(), timezonesQuery()],
    });

  const selectedLocale = locales.find((l) => l.id === config.locales[0]);
  const selectedKeymap = keymaps.find((k) => k.id === config.keymap);
  const selectedTimezone = timezones.find((t) => t.id === config.timezone);

  return {
    locales,
    keymaps,
    timezones,
    selectedLocale,
    selectedKeymap,
    selectedTimezone,
  };
};

export {
  configQuery,
  keymapsQuery,
  localesQuery,
  timezonesQuery,
  useConfigMutation,
  useL10n,
  useL10nConfigChanges,
};
