import sql from 'mssql';
 

const dbConfig = {
    user: process.env.MSSQL_DEV_USER,
    password: process.env.MSSQL_DEV_PASSWORD,
    server: process.env.MSSQL_DEV_SERVER as string,
    database: process.env.MSSQL_DEV_DATABASE,
    options: {
        encrypt: true
    }
};


export const checkIfEmailWhitelisted = async (email: string): Promise<boolean> => {
    let pool: sql.ConnectionPool | undefined;

    try {
        pool = await new sql.ConnectionPool(dbConfig).connect();

        console.log("Database connection successful");
        const request = new sql.Request(pool);
        request.input('Email', sql.NVarChar, email);
        request.output('IsWhitelisted', sql.Bit);

        const result = await request.execute('CheckIfEmailWhitelisted');


        return !!result.output.IsWhitelisted;
    } catch (error) {
        console.error('Database error:', error);
        return false;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

export const checkIfEmailAndGroup = async (email: string): Promise<{ isWhitelisted: boolean, userGroup: string | null }> => {
    let pool: sql.ConnectionPool | undefined;

    try {
        pool = await new sql.ConnectionPool(dbConfig).connect();

        const request = new sql.Request(pool);
        request.input('Email', sql.NVarChar, email);
        request.output('IsWhitelisted', sql.Bit);
        request.output('UserGroup', sql.NVarChar(50));

        const result = await request.execute('CheckIfEmailAndUserGroup');

        return {
            isWhitelisted: !!result.output.IsWhitelisted,
            userGroup: result.output.UserGroup
        };
    } catch (error) {
        console.error('Database error:', error);
        return { isWhitelisted: false, userGroup: null };
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}
