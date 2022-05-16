export type BackLinkProps = {
  label: string;
  url: string;
};

export async function BackLink({ label, url }: BackLinkProps) {
  return (
    <>
      <a href={url}>{label}</a>
      <br />
      <br />
    </>
  );
}
