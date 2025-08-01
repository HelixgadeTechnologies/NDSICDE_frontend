"use client";

import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card-wrapper";
import TextInput from "@/ui/form/text-input";
import { useSettingsFormState } from "@/store/settings-store";
import RadioComponent from "@/ui/form/switch-component";
import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";

export default function GeneralSettings() {
  const {
    organizationName,
    contactEmail,
    contactPhone,
    website,
    defaultCurrency,
    defaultTimezone,
    dataRententionPolicy,
    auditLogRetention,
    isEmailNotificationsClicked,
    isMaintenanceAlertsClicked,
    setField,
  } = useSettingsFormState();

  return (
    <section className="space-y-5">
      {/* organization setting */}
      <CardComponent>
        <Heading
          heading="Organization Settings"
          subtitle="Configure your organization details and system preferences"
          spacing="2"
        />
        <form action="" className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <DropDown
            label="Organization Name"
            value={organizationName}
            onChange={(value: string) => setField("organizationName", value)}
            name="organizationName"
            placeholder="NDSICDE"
            options={[]}
          />
          <TextInput
            label="Contact email"
            value={contactEmail}
            onChange={(e) => setField("contactEmail", e.target.value)}
            name="contactEmail"
            placeholder="admin@sdn.org"
          />
          <TextInput
            label="Contact Phone"
            value={contactPhone}
            onChange={(e) => setField("contactPhone", e.target.value)}
            name="contactPhone"
            placeholder="+1 (555) 123-4567"
          />
          <TextInput
            label="Website"
            value={website}
            onChange={(e) => setField("website", e.target.value)}
            name="website"
            placeholder="https://acmecorp.com"
          />
        </form>
      </CardComponent>

      {/* system preferences */}
      <CardComponent>
        <Heading
          heading="System Preferences"
          subtitle="Configure system-wide preferences and defaults"
          spacing="2"
        />
        <form action="" className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <DropDown
            label="Default Currency"
            value={defaultCurrency}
            placeholder="USD ($)"
            name="defaultCurrency"
            onChange={(value: string) => setField("defaultCurrency", value)}
            options={[]}
          />
          <DropDown
            label="Default Timezone"
            value={defaultTimezone}
            placeholder="Pacific Time (UTC - 8)"
            name="defaultTimezone"
            onChange={(value: string) => setField("defaultTimezone", value)}
            options={[]}
          />
          <DropDown
            label="Data Rentention Policy"
            value={dataRententionPolicy}
            onChange={(value: string) => setField("dataRententionPolicy", value)}
            name="dataRententionPolicy"
            placeholder="1 Year"
            options={[]}
          />
          <DropDown
            label="Audit Log Rentention"
            value={auditLogRetention}
            onChange={(value: string) => setField("auditLogRetention", value)}
            name="auditLogRetention"
            placeholder="3 Years"
            options={[]}
          />
        </form>
      </CardComponent>

      {/* system notifs */}
      <CardComponent>
        <Heading heading="System Notifications" />
        <section className="space-y-6 mt-4">
          <div className="flex items-center justify-between">
            <Heading
              heading="Email Notifications"
              subtitle="Send system alerts and notifications via email"
              sm
              spacing="2"
            />
            <RadioComponent
              name="emailNotifications"
              isChecked={isEmailNotificationsClicked}
              onChange={(checked) =>
                setField("isEmailNotificationsClicked", checked)
              }
            />
          </div>
          <div className="flex items-center  justify-between">
            <Heading
              heading="Maintenance Alerts"
              subtitle="Send alerts before scheduled maintenance"
              sm
              spacing="2"
            />
            <RadioComponent
              name="maintenanceAlerts"
              isChecked={isMaintenanceAlertsClicked}
              onChange={(checked) =>
                setField("isMaintenanceAlertsClicked", checked)
              }
            />
          </div>
        </section>
        <div className="flex flex-row items-center gap-2 md:gap-8 md:w-[570px] mt-8">
          <Button isSecondary content="Reset to Default" />
          <Button content="Save Changes" isDisabled />
        </div>
      </CardComponent>
    </section>
  );
}
