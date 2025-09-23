"use client";

import Button from "@/ui/form/button";
import Table from "@/ui/table";
import { useUIStore } from "@/store/ui-store";
import AddNewRole from "./add-new-role";
import EditRole from "./edit-role";
import Heading from "@/ui/text-heading";
import CardComponent from "@/ui/card-wrapper";

export default function AccessControl() {
  const head = ["Role Name", "Permission Level", "Users", "Status", "Actions"];

  const data = [
    {
      roleName: "Super Admin",
      permissionLevel: "Full Access",
      users: 5,
      status: "Active",
    },
    {
      roleName: "Admin",
      permissionLevel: "Full Access",
      users: 5,
      status: "Inactive",
    },
  ];

  const { isAddModalOpen, isEditModalOpen, openAddModal, openEditModal } =
    useUIStore();

  return (
    <section>
      <CardComponent>
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-4 md:gap-0">
          <Heading
            heading="User Roles & Permissions"
            subtitle="Manage user roles and their associated permissions"
            spacing="1"
          />
          <div className="w-[228px]">
            <Button
              content="Add New Role"
              icon="si:add-fill"
              onClick={openAddModal}
            />
          </div>
        </div>

        <Table
          tableHead={head}
          tableData={data}
          renderRow={(row) => (
            <>
              <td className="px-6">{row.roleName}</td>
              <td className="px-6">{row.permissionLevel}</td>
              <td className="px-6">{row.users}</td>
              <td className="px-6">
                <span
                  className={
                    row.status === "Active" ? "text-green-500" : "text-red-500"
                  }
                >
                  {row.status}
                </span>
              </td>
              <td
                onClick={openEditModal}
                className="px-6 cursor-pointer hover:text-[#111928]"
              >
                Edit
              </td>
            </>
          )}
        />
      </CardComponent>

      {isAddModalOpen && <AddNewRole />}

      {isEditModalOpen && <EditRole />}
    </section>
  );
}
