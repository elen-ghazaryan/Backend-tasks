import { Injectable, NotFoundException, Param } from '@nestjs/common';
import bcrypt from 'bcrypt'

type IUser = {
  id: string
  username: string
  login: string
  password: string
  age: number
}

type IUpdateUser = {
  username?: string
  login?: string
  password?: string
  age?: number
}

@Injectable()
export class UsersService {
  private users: IUser[] = [{id: "1",username:"narek1234", password:"narek1234", age:20, login:"narek1234"}];

  getUsers() {
    return this.users
  }

  getUserById(id: string) {
    const user = this.users.find(u => u.id === id)
    if(!user) {
      throw new NotFoundException(`User not found`)
    }

    return this.users.find(user => user.id === id)
  }

  deleteUser(id: string) {
    const user = this.users.find(u => u.id === id)
    if(!user) {
      throw new NotFoundException(`User not found`)
    }

    this.users = this.users.filter(u => u.id !== id)
    return id;
  }

  async addUser(user: Omit<IUser, 'id'>) {
    const hash = user.password ? await bcrypt.hash(user.password, 10) : ""

    const newUser = {
      id: crypto.randomUUID(),
      username: user.username,
      login: user.login,
      password: hash,
      age: user.age
    }
    this.users.push(newUser)
    return {
      id: newUser.id,
      username: newUser.username,
      login: newUser.login,
      age: newUser.age
    }
  }

  async updateUser(id: string, updateData: IUpdateUser) {
    const userIndex = this.users.findIndex(u => u.id === id);
    if(userIndex === -1) {
      throw new NotFoundException(`User not found`)
    }

    if(updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10)
    }

    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...cleanUpdateData
    };

    const updatedUser = this.users[userIndex];
    console.log(this.users[userIndex])
    return {
      id: updatedUser.id,
      username: updatedUser.username,
      login: updatedUser.login,
      age: updatedUser.age
    }
  }

  findByLogin (login: string) {
    return this.users.find(user => user.login === login)
  }

}
