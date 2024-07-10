import { LOCAL_STORAGE_KEYS } from "@/constants";
import { Button, ButtonProps } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconFingerprint } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";

type ClockInButtonProps = {
  onClockIn?: () => void;
} & ButtonProps;

export function ClockInButton({ onClockIn }: ClockInButtonProps) {
  const [id] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.MISA_SESSION_ID,
    defaultValue: "",
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["timekeeping"],
    mutationFn: async () => {
      const res = await fetch("/api/misa", {
        method: "POST",
        headers: { "X-Misa-Session-ID": id },
      });
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error("Unknown error");
      }
    },
  });

  const buttonDisabled = useMemo(() => {
    return isPending || !id;
  }, [isPending, id]);

  const handleClockIn = async () => {
    try {
      await mutateAsync();
      toast.success("Clocked in successfully");
      if (onClockIn) {
        onClockIn();
      }
    } catch (error) {
      toast.error(
        "Clocking in failed. Maybe the session ID is invalid or expired. Please check your session ID and try again.",
      );
    }
  };

  return (
    <Button
      color={"orange.8"}
      fullWidth
      size="lg"
      onClick={handleClockIn}
      loading={isPending}
      disabled={buttonDisabled}
      leftSection={<IconFingerprint size={32} stroke={1.5} />}
    >
      Clock in now
    </Button>
  );
}
