const DAO = require('../../lib/dao')
const mySQLWrapper = require('../../lib/mysqlWrapper')

class BaseModel extends DAO {

    /**
     * Returns a van_request by its emp_no
     */
    static async getByID(_, { id }) {
        return await this.find(id)
    }

    static async total(_, fields) {
        return await this.totalRow({ fields })
    }

    /**
     * Returns a list of users matching the passed fields
     * @param {*} fields - Fields to be matched
     */
    static async findMatching(_, columns, fields, limit, offset, order = {by: 'id', direction: 'ASC'}) {
        // Returns early with all users if no criteria was passed
        if (Object.keys(fields).length === 0) return this.findAll(limit, offset, order)
        
        // Find matching bacons
        return this.findByFields({ columns, fields, limit, offset, order })
    }

    static async findOne(_, columns, fields) {

        // Find matching bacons
        let rows = await this.findByFields({
            columns, fields
        })

        if (rows.length > 0) {
            return rows[0]
        }

        return null
    }

    static async createEntry(_, fields) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        let data = {}
        const ignoreColumns = []
        Object.keys(fields).forEach((key) => {
            if(!ignoreColumns.includes(key)){
                data[key] = fields[key]
            }
        })
        try {
            let _result = await this.insert(connection, {
                data
            })
            return this.getByID(_, { id: _result.insertId })
        } finally {
            // Releases the connection
            if (connection != null) connection.release()
        }
    }

    static async createEntries(_, items) {
        try {
            const ignoreColumns = []
            const connection = await mySQLWrapper.getConnectionFromPool()
            mySQLWrapper.beginTransaction(connection)
            items.forEach(item => {
                let data = {}
                Object.keys(item).forEach((key) => {
                    if(!ignoreColumns.includes(key)){
                        data[key] = item[key]
                    }
                })
                this.insert(connection, {
                    'data': data
                })
            });
            await mySQLWrapper.commit(connection)
        } 
        catch(e) {
            return fail(e)
        }
        return true;
    }

    static async updateEntry(_, { id, fields }) {
        const ignoreColumns = []
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

    static async updateEntries(_, items, fields = []) {
        try {
            const ignoreColumns = []
            const connection = await mySQLWrapper.getConnectionFromPool()
            mySQLWrapper.beginTransaction(connection)
            items.forEach(item => {
                let data = {}
                Object.keys(item).forEach((key) => {
                    if(!ignoreColumns.includes(key)){
                        data[key] = item[key]
                    }
                })
                if(fields.length == 0) {
                    this.update(connection, {
                        'id': data.id,
                        'data': data
                    })
                }
                else {
                    this.updateByField(connection, {
                        'data': data,
                        'fields': fields
                    })
                }
            });
            return await mySQLWrapper.commit(connection)
        } 
        catch(e) {
            return fail(e)
        }
        return true;
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

    static async removeEntries(_, { ids }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            await this.deleteMultiple(connection, { ids })
            return { ids }
        } finally {
            // Releases the connection
            if (connection != null) connection.release()
        }
    }

    static async removeByField(_, { fields }) {
        const connection = await mySQLWrapper.getConnectionFromPool()
        try {
            await this.deleteByFields(connection, { fields })
            return { fields }
        } finally {
            // Releases the connection
            if (connection != null) connection.release()
        }
    }
}

module.exports = BaseModel