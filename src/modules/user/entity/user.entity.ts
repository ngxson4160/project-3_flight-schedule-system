// import { BaseEntity } from 'src/common/models/base.model';
// import { UserRole } from 'src/modules/user-role/entity/user-role.entity';
// import { Column, Entity, OneToMany } from 'typeorm';

// @Entity({name: 'user'})
// export class User extends BaseEntity {
//   @Column({ name: 'user_name' })
//   userName: string;

//   @Column()
//   email: string;

//   @Column()
//   password: string;

//   @Column({ name: 'first_name' })
//   firstName: string;

//   @Column({ name: 'last_name' })
//   lastName: string;

//   @Column({ name: 'phone_number' })
//   phoneNumber: string;

//   @Column()
//   dob: Date;

//   @Column({default: true})
//   status: Boolean;

//   @OneToMany(() => UserRole, (UserRole) => UserRole.userId)
//   userRole: UserRole
// }
