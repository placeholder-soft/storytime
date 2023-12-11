import { useSuiClientQuery } from "@mysten/dapp-kit";

export function Query() {
  const { data, isPending, isError, error } = useSuiClientQuery(
    "getObject",
    {
      id: "0x1187a4e4af2935443758fc285838faec521f6d6871266f271b91ad2de886cabc",
      options: {
        showType: true,
        showOwner: true,
        showPreviousTransaction: true,
        showDisplay: true,
        showContent: true,
        showBcs: true,
        showStorageRebate: true,
      },
    },
    {
      gcTime: 10000,
    }
  );

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
