/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type EncryptionMethod = "luks1" | "luks2" | "tpmFde";
/**
 * Alias used to reference a device.
 */
export type Alias = string;
export type FilesystemType =
  | "bcachefs"
  | "btrfs"
  | "exfat"
  | "ext2"
  | "ext3"
  | "ext4"
  | "f2fs"
  | "jfs"
  | "nfs"
  | "nilfs2"
  | "ntfs"
  | "reiserfs"
  | "swap"
  | "tmpfs"
  | "vfat"
  | "xfs";
export type SpacePolicy = "delete" | "resize" | "keep" | "custom";
export type PtableType = "gpt" | "msdos" | "dasd";
export type PartitionId = "linux" | "swap" | "lvm" | "raid" | "esp" | "prep" | "bios_boot";

/**
 * Config model
 */
export interface Config {
  boot?: Boot;
  encryption?: Encryption;
  drives?: Drive[];
  volumeGroups?: VolumeGroup[];
}
export interface Boot {
  configure: boolean;
  device?: BootDevice;
}
export interface BootDevice {
  default: boolean;
  name?: string;
}
export interface Encryption {
  method: EncryptionMethod;
  password?: string;
}
export interface Drive {
  name: string;
  alias?: Alias;
  mountPath?: string;
  filesystem?: Filesystem;
  spacePolicy?: SpacePolicy;
  ptableType?: PtableType;
  partitions?: Partition[];
}
export interface Filesystem {
  reuse?: boolean;
  default: boolean;
  type?: FilesystemType;
  snapshots?: boolean;
  label?: string;
}
export interface Partition {
  name?: string;
  alias?: Alias;
  id?: PartitionId;
  mountPath?: string;
  filesystem?: Filesystem;
  size?: Size;
  delete?: boolean;
  deleteIfNeeded?: boolean;
  resize?: boolean;
  resizeIfNeeded?: boolean;
}
export interface Size {
  default: boolean;
  min: number;
  max?: number;
}
export interface VolumeGroup {
  name: string;
  extentSize?: number;
  targetDevices?: Alias[];
  logicalVolumes?: LogicalVolume[];
}
export interface LogicalVolume {
  name?: string;
  mountPath?: string;
  filesystem?: Filesystem;
  size?: Size;
  stripes?: number;
  stripeSize?: number;
}
