use utoipa::OpenApi;
#[derive(OpenApi)]
#[openapi(
    info(description = "Agama web API description"),
    paths(
        crate::l10n::web::get_config,
        crate::l10n::web::keymaps,
        crate::l10n::web::locales,
        crate::l10n::web::set_config,
        crate::l10n::web::timezones,
        crate::manager::web::finish_action,
        crate::manager::web::install_action,
        crate::manager::web::installer_status,
        crate::manager::web::probe_action,
        crate::network::web::add_connection,
        crate::network::web::apply,
        crate::network::web::connect,
        crate::network::web::connections,
        crate::network::web::delete_connection,
        crate::network::web::devices,
        crate::network::web::disconnect,
        crate::network::web::update_connection,
        crate::questions::web::answer_question,
        crate::questions::web::get_answer,
        crate::questions::web::delete_question,
        crate::questions::web::create_question,
        crate::questions::web::list_questions,
        crate::software::web::get_config,
        crate::software::web::patterns,
        crate::software::web::probe,
        crate::software::web::products,
        crate::software::web::proposal,
        crate::software::web::set_config,
        crate::storage::web::actions,
        crate::storage::web::devices_dirty,
        crate::storage::web::get_proposal_settings,
        crate::storage::web::probe,
        crate::storage::web::product_params,
        crate::storage::web::set_proposal_settings,
        crate::storage::web::staging_devices,
        crate::storage::web::system_devices,
        crate::storage::web::usable_devices,
        crate::storage::web::volume_for,
        crate::storage::web::iscsi::delete_node,
        crate::storage::web::iscsi::discover,
        crate::storage::web::iscsi::initiator,
        crate::storage::web::iscsi::login_node,
        crate::storage::web::iscsi::logout_node,
        crate::storage::web::iscsi::nodes,
        crate::storage::web::iscsi::update_initiator,
        crate::storage::web::iscsi::update_node,
        crate::users::web::get_root_config,
        crate::users::web::get_user_config,
        crate::users::web::patch_root,
        crate::users::web::remove_first_user,
        crate::users::web::set_first_user,
        super::http::ping
    ),
    components(
        schemas(agama_lib::manager::InstallationPhase),
        schemas(agama_lib::network::settings::NetworkConnection),
        schemas(agama_lib::network::types::DeviceType),
        schemas(agama_lib::product::Product),
        schemas(agama_lib::software::Pattern),
        schemas(agama_lib::storage::model::Action),
        schemas(agama_lib::storage::model::BlockDevice),
        schemas(agama_lib::storage::model::Component),
        schemas(agama_lib::storage::model::Device),
        schemas(agama_lib::storage::model::DeviceInfo),
        schemas(agama_lib::storage::model::DeviceSid),
        schemas(agama_lib::storage::model::Drive),
        schemas(agama_lib::storage::model::DriveInfo),
        schemas(agama_lib::storage::model::DeviceSize),
        schemas(agama_lib::storage::model::Filesystem),
        schemas(agama_lib::storage::model::LvmLv),
        schemas(agama_lib::storage::model::LvmVg),
        schemas(agama_lib::storage::model::Md),
        schemas(agama_lib::storage::model::Multipath),
        schemas(agama_lib::storage::model::Partition),
        schemas(agama_lib::storage::model::PartitionTable),
        schemas(agama_lib::storage::model::ProposalSettings),
        schemas(agama_lib::storage::model::ProposalSettingsPatch),
        schemas(agama_lib::storage::model::ProposalTarget),
        schemas(agama_lib::storage::model::Raid),
        schemas(agama_lib::storage::model::SpaceAction),
        schemas(agama_lib::storage::model::SpaceActionSettings),
        schemas(agama_lib::storage::model::UnusedSlot),
        schemas(agama_lib::storage::model::Volume),
        schemas(agama_lib::storage::model::VolumeOutline),
        schemas(agama_lib::storage::model::VolumeTarget),
        schemas(agama_lib::storage::client::iscsi::ISCSIAuth),
        schemas(agama_lib::storage::client::iscsi::ISCSIInitiator),
        schemas(agama_lib::storage::client::iscsi::ISCSINode),
        schemas(agama_lib::storage::client::iscsi::LoginResult),
        schemas(agama_lib::users::FirstUser),
        schemas(crate::l10n::Keymap),
        schemas(crate::l10n::LocaleEntry),
        schemas(crate::l10n::TimezoneEntry),
        schemas(agama_lib::localization::model::LocaleConfig),
        schemas(crate::manager::web::InstallerStatus),
        schemas(crate::network::model::Connection),
        schemas(crate::network::model::Device),
        schemas(agama_lib::questions::model::Answer),
        schemas(agama_lib::questions::model::GenericAnswer),
        schemas(agama_lib::questions::model::GenericQuestion),
        schemas(agama_lib::questions::model::PasswordAnswer),
        schemas(agama_lib::questions::model::Question),
        schemas(agama_lib::questions::model::QuestionWithPassword),
        schemas(agama_lib::software::model::SoftwareConfig),
        schemas(crate::software::web::SoftwareProposal),
        schemas(crate::storage::web::ProductParams),
        schemas(crate::storage::web::iscsi::DiscoverParams),
        schemas(crate::storage::web::iscsi::InitiatorParams),
        schemas(crate::storage::web::iscsi::LoginParams),
        schemas(crate::storage::web::iscsi::NodeParams),
        schemas(agama_lib::users::model::RootConfig),
        schemas(agama_lib::users::model::RootPatchSettings),
        schemas(super::http::PingResponse)
    )
)]
pub struct ApiDoc;
