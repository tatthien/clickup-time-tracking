import {
  Anchor,
  Button,
  FocusTrap,
  PasswordInput,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import toast from "react-hot-toast";
import { useForm } from "@mantine/form";
import { DEFAULT_APP_SETTINGS, LOCAL_STORAGE_KEYS } from "@/constants";
import { AppSettings, ClockifyUser } from "@/types";
import { CollapsibleCard } from "./CollapsibleCard";
import { IconSettings } from "@tabler/icons-react";

const fetchCurrentUser = async (apiKey: string): Promise<ClockifyUser> => {
  const res = await fetch("https://api.clockify.me/api/v1/user", {
    headers: {
      "X-API-Key": apiKey,
    },
  });
  const data = await res.json();
  if (res.ok) return data;
  throw data;
};

export function SettingsForm() {
  const [isFetchingUser, setIsFetchingUser] = useState(false);

  const [settings, setSettings] = useLocalStorage<AppSettings>({
    key: LOCAL_STORAGE_KEYS.APP_SETTINGS,
    defaultValue: DEFAULT_APP_SETTINGS,
  });

  const form = useForm({
    initialValues: {
      clickup: settings.clickup,
      clockify: settings.clockify,
    },
  });

  useEffect(() => {
    form.setValues({
      clickup: settings.clickup,
      clockify: settings.clockify,
    });
  }, [settings]);

  const handleSubmit = async (values: any) => {
    try {
      setIsFetchingUser(true);

      // Fetching current Clockify user
      const user = await fetchCurrentUser(values.clockify);

      setSettings({
        clickup: values.clickup,
        clockify: values.clockify,
        user: {
          id: user.id,
          name: user.name,
          profilePicture: user.profilePicture,
          activeWorkspace: user.activeWorkspace,
          defaultWorkspace: user.defaultWorkspace,
        },
        workspaceId: user.activeWorkspace,
      });

      toast.success("Settings saved");
    } catch (err: any) {
      if (err.code && err.code === 4003) {
        toast.error("Clockify API key is invalid");
      } else {
        toast.error("Failed to save settings");
      }
    } finally {
      setIsFetchingUser(false);
    }
  };

  return (
    <CollapsibleCard
      icon={
        <Text span fz={0} c="gray.5">
          <IconSettings stroke={1.5} color="currentColor" />
        </Text>
      }
      title="Settings"
      id="app_settings_card"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack mb={8}>
          <FocusTrap active={true}>
            <PasswordInput
              label="ClickUp token"
              data-autofocus
              style={{ flex: 1 }}
              placeholder="Enter your ClickUp personal token here"
              {...form.getInputProps("clickup")}
            />
          </FocusTrap>
          <PasswordInput
            label="Clockify API key"
            style={{ flex: 1 }}
            placeholder="Enter your Clockify API key here"
            {...form.getInputProps("clockify")}
          />
          <Button
            type="submit"
            w={"100%"}
            loading={isFetchingUser}
            disabled={isFetchingUser}
          >
            Save
          </Button>
        </Stack>

        <Anchor fz={12} href="/how-to-get-token.webp" target="_blank">
          How to retrieve your ClickUp personal token and Clockify API key?
        </Anchor>
      </form>
    </CollapsibleCard>
  );
}