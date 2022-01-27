import { Table } from "../components/Table";

export default function Example() {
  return (
    <main>
      <div suppressHydrationWarning style={{ height: "100%" }}>
        {typeof document === "undefined" ? null : <Table />}
      </div>
    </main>
  );
}
