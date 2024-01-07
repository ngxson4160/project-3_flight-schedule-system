// import { RolePermission } from "src/modules/role-permission/entity/role-permission.entity";
// import { UserRole } from "src/modules/user-role/entity/user-role.entity";
// import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// @Entity({name: 'role'})
// export class Role {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column()
//     name: string;

//     @OneToMany(() => RolePermission, (RolePermission) => RolePermission.role)
//     rolePermission: RolePermission;

//     @OneToMany(() => UserRole, (UserRole) => UserRole.role)
//     userRole: UserRole;
// }
