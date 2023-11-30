/* eslint-disable prettier/prettier */
import { z } from "zod";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export function SchemaUser (user: CreateUserDto){

    const userSchema = z.object({
        username: z.string().email(),
    })
    
    try {
        userSchema.parse(user);
        return {"status": 200};
    } catch (e) {
        return {"status": 403};
    }

}