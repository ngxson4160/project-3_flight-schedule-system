// import { Permission } from "src/modules/permission/entity/permission.entity";
// import { Role } from "src/modules/role/entity/role.entity";
// import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

// @Entity({name: 'role_permission'})
// export class RolePermission {
//     @PrimaryColumn()
//     roleId: number;

//     @PrimaryColumn()
//     permissionId: number;

//     @ManyToOne(() => Role, (Role) => Role.id)
//     role: number;

//     @ManyToOne(() => Permission, (Permission) => Permission.id)
//     permission: Permission;
// }
