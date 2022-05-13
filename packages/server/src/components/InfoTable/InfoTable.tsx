import { BaseProps } from "tsx-ssr";

export const InfoTable = ({ children }: BaseProps) => <table>{children}</table>;

export type InfoRowProps = BaseProps & { label: string };

export const InfoRow = ({ label, children }: InfoRowProps) => (
  <tr>
    <td>{label}:</td>
    <td>{children}</td>
  </tr>
);
