"use client";

import Button from "@/ui/button";
import Table from "@/ui/table";
import { useUIStore } from "@/store/ui-store";
import AddNewRole from "./add-new-role";
import EditRole from "./edit-role";

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

   const {
    isAddModalOpen,
    isEditModalOpen,
    openAddModal,
    openEditModal,
  } = useUIStore();

  return (
    <section>
      <div className="h-fit w-full rounded-lg bg-white px-3 md:px-6 py-[35px] shadow-md border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-4 md:gap-0">
          <div className="text-gray-800 md:leading-6 pspace-y-1 md:space-y-4">
            <h2 className="text-xl md:text-2xl font-bold whitespace-nowrap">User Roles & Permissions</h2>
            <p className="text-xs md:text-sm font-normal">
              Manage user roles and their associated permissions
            </p>
          </div>
          <div className="w-[228px]">
            <Button content="Add New Role" icon="cil:plus" onClick={openAddModal} />
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
              <td onClick={openEditModal} className="px-6 cursor-pointer hover:text-[#111928]">Edit</td>
            </>
          )}
        />
      </div>
      
      {isAddModalOpen && <AddNewRole/>}

      {isEditModalOpen && <EditRole/>}
    </section>
  );
}
