import Icon from "@ant-design/icons";

const DashboardSvg = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="0" y="0" width="7" height="7" rx="1.5" />
    <rect x="9" y="0" width="7" height="7" rx="1.5" />
    <rect x="0" y="9" width="7" height="7" rx="1.5" />
    <rect x="9" y="9" width="7" height="7" rx="1.5" />
  </svg>
);

const AnalyticsSvg = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <circle cx="8" cy="8" r="7" />
    <path d="M8 8 L8 3" />
    <path d="M8 8 L12 10" />
  </svg>
);

const TransactionSvg = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
  >
    <path d="M2 5h12M2 5l3-3M2 5l3 3" />
    <path d="M14 11H2M14 11l-3-3M14 11l-3 3" />
  </svg>
);

const SettingsSvg = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <circle cx="8" cy="8" r="2.5" />
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" />
  </svg>
);

const AccountSvg = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <circle cx="8" cy="5" r="3" />
    <path d="M2 14c0-3.31 2.69-6 6-6s6 2.69 6 6" />
  </svg>
);

const TrendUpSvg = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M1 10L5 6L8 9L13 4" />
    <path d="M9 4h4v4" />
  </svg>
);

const TrendDownSvg = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M1 4L5 8L8 5L13 10" />
    <path d="M9 10h4V6" />
  </svg>
);

const PlusSvg = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M7 1v12M1 7h12" />
  </svg>
);

const FilterSvg = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="M1 3h13M3.5 7h8M6 11h3" />
  </svg>
);

const ExportSvg = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="M7.5 1v9M4 7l3.5 3.5L11 7" />
    <path d="M2 12h11" />
  </svg>
);

const EditSvg = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" />
  </svg>
);

const DeleteSvg = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="M2 4h10M5 4V2h4v2M5.5 7v4M8.5 7v4M3 4l.8 8h6.4L11 4" />
  </svg>
);

const SearchSvg = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <circle cx="6.5" cy="6.5" r="5" />
    <path d="M10.5 10.5L13.5 13.5" />
  </svg>
);

const InsightSvg = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <path d="M2 12l3-4 3 2 3-5 3 3" />
    <path d="M2 14h12" />
  </svg>
);

export const DashboardIcon = (props) => (
  <Icon component={DashboardSvg} {...props} />
);
export const AnalyticsIcon = (props) => (
  <Icon component={AnalyticsSvg} {...props} />
);
export const TransactionIcon = (props) => (
  <Icon component={TransactionSvg} {...props} />
);
export const SettingsIcon = (props) => (
  <Icon component={SettingsSvg} {...props} />
);
export const AccountIcon = (props) => (
  <Icon component={AccountSvg} {...props} />
);
export const TrendUpIcon = (props) => (
  <Icon component={TrendUpSvg} {...props} />
);
export const TrendDownIcon = (props) => (
  <Icon component={TrendDownSvg} {...props} />
);
export const PlusIcon = (props) => <Icon component={PlusSvg} {...props} />;
export const FilterIcon = (props) => <Icon component={FilterSvg} {...props} />;
export const ExportIcon = (props) => <Icon component={ExportSvg} {...props} />;
export const EditIcon = (props) => <Icon component={EditSvg} {...props} />;
export const DeleteIcon = (props) => <Icon component={DeleteSvg} {...props} />;
export const SearchIcon = (props) => <Icon component={SearchSvg} {...props} />;
export const InsightIcon = (props) => (
  <Icon component={InsightSvg} {...props} />
);
