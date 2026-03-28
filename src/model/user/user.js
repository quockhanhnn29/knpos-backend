const DAO = require('../../lib/dao')
const mySQLWrapper = require('../../lib/mysqlWrapper')

class User extends DAO {

    /**
     * Overrides TABLE_NAME with this class' backing table at MySQL
     */
    static get TABLE_NAME() {
        return 'users'
    }

    static get QUICK_SEARCH_FIELDS() {
        return [
            'user_name',
            'email'
        ]
    }

    /**
     * Returns a user by its ID
     */
    static async getByID(_, { id }) {
        return await this.find(id)
    }

    /**
     * Returns a list of users matching the passed fields
     * @param {*} fields - Fields to be matched
     */
    static async findMatching(_, columns, fields, limit, offset, order = {by: 'id', direction: 'ASC'}) {
        // Returns early with all users if no criteria was passed
        if (Object.keys(fields).length === 0) return this.findAll(limit, offset, order)

        // Find matching bacons
        return this.findByFields({
            columns, fields, limit, offset, order
        })
    }

    static async findOne(_, columns, fields) {
        // Find matching bacons
        let rows = await this.findByFields({
            columns, fields
        })

        if(rows.length > 0){
            return rows[0]
        }

        return null
    }

    /**
     * Creates a new user
     */
    static async createEntry(_, { fields }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            let data = {}
            const ignoreColumns = ['created_date', 'modified_date']
            Object.keys(fields).forEach((key) => {
                if(!ignoreColumns.includes(key)){
                    data[key] = fields[key]
                }
            })
            let _result = await this.insert(connection, {
                data
            })

            return this.getByID(_, { id: _result.insertId })
        } finally {
            // Releases the connection
            if (connection != null) connection.release()
        }
    }

    /**
     * Updates a user 
     */
    static async updateEntry(_, { id, fields }) {
        const ignoreColumns = ['created_date', 'modified_date']
        const connection = await mySQLWrapper.getConnectionFromPool()
        let data = {}
        Object.keys(fields).forEach((key) => {
            if(!ignoreColumns.includes(key)){
                data[key] = fields[key]
            }
        })
        try {
            await this.update(connection, {
                id,
                data
            })
            return this.getByID(_, { id })
        } finally {
            // Releases the connection
            if (connection != null) connection.release()
        }
    }

    static async removeEntry(_, { id }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            await this.delete(connection, { id })
            return { id }
        } finally {
            // Releases the connection
            if (connection != null) connection.release()
        }
    }
}

module.exports = User