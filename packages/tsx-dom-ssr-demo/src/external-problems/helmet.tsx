// helmet replacement

// Idea 1: By doing querySelector and moving the scripts into head before rendering to string?
export function WithScript() {
  return (
    <head>
      <script src="https://..." async />
    </head>
  );
}
