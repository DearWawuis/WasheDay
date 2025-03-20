import Role from "../models/Roles";

export const createRoles = async () => {
    try {
        //Verificar si existen roles en la bd
        const count = await Role.estimatedDocumentCount();
        //Si no existen los crea
        if(count > 0) return;
        //Crear roles por defecto envolviendo en una promesa
        const values = await Promise.all([
            new Role({ name: "washer" }).save(),
            new Role({ name: "washo" }).save(),
            new Role({ name: "admin" }).save()
        ]);
        console.log(values);
    } catch(error) {
        console.error(error);
    }
}