/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card-wrapper";
import TextInput from "@/ui/form/text-input";
import { useSettingsFormState } from "@/store/super-admin-store/settings-store";
import RadioComponent from "@/ui/form/switch-component";
import Button from "@/ui/form/button";
import DropDown from "@/ui/form/select-dropdown";
import { currency, timezones, years } from "@/lib/config/admin-settings";
import { FormEvent, useState, useEffect } from "react";
import { apiAdminSettings, apiGetGeneralSettings } from "@/lib/api/settings";
import { useRoleStore } from "@/store/role-store";
import { Icon } from "@iconify/react";
import Modal from "@/ui/popup-modal";
import Loading from "@/app/loading";

export default function GeneralSettings() {
  const {
    organizationName,
    contactEmail,
    contactPhone,
    website,
    organizationLogo,
    generalSettingsId,
    defaultCurrency,
    defaultTimezone,
    dataRententionPolicy,
    auditLogRetention,
    isEmailNotificationsClicked,
    isMaintenanceAlertsClicked,
    setField,
    resetForm,
  } = useSettingsFormState();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [openConfirmReset, setOpenConfirmReset] = useState(false);

  const { token } = useRoleStore();

  // Fetch existing settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!token) return;

      setIsFetching(true);
      try {
        const response = await apiGetGeneralSettings(token);

        if (response.success && response.data) {
          const data = response.data;

          setField("generalSettingsId", data.generalSettingsId || "");
          setField("organizationName", data.organizationName || "");
          setField("contactEmail", data.contactEmail || "");
          setField("contactPhone", data.contactPhone || "");
          setField("website", data.website || "");
          setField("organizationLogo", data.organizationLogo || "");
          setField("defaultCurrency", data.defaultCurrency || "");
          setField("defaultTimezone", data.defaultTimeZone || "");
          setField("dataRententionPolicy", data.dateRetentionPolicy || "");
          setField("auditLogRetention", data.auditLogRetention || "");
          setField(
            "isEmailNotificationsClicked",
            data.emailNotification || false
          );
          setField(
            "isMaintenanceAlertsClicked",
            data.maintenanceAlert || false
          );

          setIsEditMode(!!data.generalSettingsId);
        }
      } catch (error: any) {
        console.error("Failed to fetch general settings:", error);
        setIsEditMode(false);
      } finally {
        setIsFetching(false);
      }
    };

    fetchSettings();
  }, [token, setField]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!organizationName || !contactEmail) {
      setError("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (website) {
      try {
        new URL(website);
      } catch {
        setError("Please enter a valid website URL");
        return;
      }
    }

    setIsLoading(true);

    try {
      const settingsData = {
        generalSettingsId: generalSettingsId || "",
        organizationName,
        contactEmail,
        contactPhone: contactPhone || "",
        website: website || "",
        organizationLogo: organizationLogo || "",
        defaultCurrency,
        defaultTimeZone: defaultTimezone,
        dateRetentionPolicy: dataRententionPolicy,
        auditLogRetention,
        emailNotification: Boolean(isEmailNotificationsClicked),
        maintenanceAlert: Boolean(isMaintenanceAlertsClicked),
      };

      if (!token) {
        setError("Authentication required");
        return;
      }

      // isCreate = true for new settings, false for updating existing
      const isCreate = !isEditMode;
      const response = await apiAdminSettings(settingsData, token, isCreate);

      if (response.success) {
        setSuccessMessage(
          response.message ||
            `Settings ${isEditMode ? "updated" : "created"} successfully`
        );

        if (!isEditMode && response.data) {
          setField("generalSettingsId", response.data);
          setIsEditMode(true);
        }
      } else {
        setError(response.message || "Failed to save settings");
      }
    } catch (error: any) {
      console.error("Settings save error:", error);
      setError(error.message || "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = (e: FormEvent) => {
    e.preventDefault();
    resetForm();
    setError("");
    setSuccessMessage("Settings reset to default values");
    setIsEditMode(false);
    setOpenConfirmReset(false);
  };

  if (isFetching) {
    return <Loading />;
  }

  return (
    <section>
      <form onSubmit={handleSubmit} className="space-y-5">
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md relative text-sm">
            {successMessage}
            <Icon
              icon="formkit:close"
              width={22}
              height={22}
              onClick={() => setSuccessMessage("")}
              className="absolute right-3 top-3 cursor-pointer"
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <CardComponent>
          <Heading
            heading="Organization Settings"
            subtitle="Configure your organization details"
            spacing="2"
          />
          <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Organization Name *"
              value={organizationName}
              onChange={(e) => setField("organizationName", e.target.value)}
              name="organizationName"
              placeholder="NDSICDE"
            />
            <TextInput
              label="Contact Email *"
              value={contactEmail}
              onChange={(e) => setField("contactEmail", e.target.value)}
              name="contactEmail"
              placeholder="super.admin@sdn.org"
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
          </div>
        </CardComponent>

        <CardComponent>
          <Heading
            heading="System Preferences"
            subtitle="Configure system-wide preferences"
            spacing="2"
          />
          <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <DropDown
              label="Default Currency"
              value={defaultCurrency}
              placeholder="USD ($)"
              name="defaultCurrency"
              onChange={(value: string) => setField("defaultCurrency", value)}
              options={currency}
            />
            <DropDown
              label="Default Timezone"
              value={defaultTimezone}
              placeholder="Pacific Time (UTC - 8)"
              name="defaultTimezone"
              onChange={(value: string) => setField("defaultTimezone", value)}
              options={timezones}
            />
            <DropDown
              label="Data Retention Policy"
              value={dataRententionPolicy}
              onChange={(value: string) =>
                setField("dataRententionPolicy", value)
              }
              name="dataRententionPolicy"
              placeholder="1 Year"
              options={years}
            />
            <DropDown
              label="Audit Log Retention"
              value={auditLogRetention}
              onChange={(value: string) => setField("auditLogRetention", value)}
              name="auditLogRetention"
              placeholder="3 Years"
              options={years}
            />
          </div>
        </CardComponent>

        <CardComponent>
          <Heading heading="System Notifications" />
          <section className="space-y-6 mt-4">
            <div className="flex items-center justify-between">
              <Heading
                heading="Email Notifications"
                subtitle="Send system alerts via email"
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
            <div className="flex items-center justify-between">
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
          <div className="flex flex-row items-center gap-2 md:gap-8 md:w-142.5 mt-8">
            <Button
              isSecondary
              content="Reset to Default"
              onClick={() => setOpenConfirmReset(true)}
            />
            <Button
              content={
                isLoading
                  ? "Saving..."
                  : `${isEditMode ? "Update" : "Create"} Settings`
              }
              isDisabled={isLoading}
              isLoading={isLoading}
            />
          </div>
        </CardComponent>
      </form>

      <Modal
        isOpen={openConfirmReset}
        onClose={() => setOpenConfirmReset(false)}>
        <div className="space-y-3">
          <Heading
            heading="Reset Settings"
            subtitle="Are you sure you want to reset all settings to default values?"
            className="text-center"
          />
          <div className="flex items-center gap-4">
            <Button
              content="Cancel"
              isSecondary
              onClick={() => setOpenConfirmReset(false)}
            />
            <Button content="Reset" onClick={() => handleReset} />
          </div>
        </div>
      </Modal>
    </section>
  );
}
