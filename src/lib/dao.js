const mysql = require('./mysqlWrapper')
class DAO {
    /**
     * This property can be overriden when the ID column is differet from 'id'
     */
    static get PRIMARY_KEY() {
        return "id"
    }

    static async queryBySQL(sql, limit, offset) {
        let params = [];
        if (limit != null && !isNaN(limit)) {
            sql += " LIMIT ?"
            params.push(limit)
        }

        if (offset != null && !isNaN(offset)) {
            sql += " OFFSET ?"
            params.push(offset)
        }
        return (await mysql.createQuery({
            query: sql,
            params
        }))
    }

    /**
     * Retrieves total of entries
     */
    static async totalRow({fields}) {
        let baseQuery = `SELECT COUNT(*) as total FROM ??`

        let params = [this.TABLE_NAME]
        let conditions = []

        if (fields) {
            Object.keys(fields).forEach((key) => {
                if (key == 'quick_search') return
                if(Array.isArray(fields[key])){
                    conditions.push(`${key} IN (?)`)
                    params.push(fields[key])
                } else {
                    conditions.push(`${key} = ?`)
                    params.push(fields[key])
                }
            })
        }

        let orConditions = []
        var search_term = fields['quick_search']
        if (this.QUICK_SEARCH_FIELDS && this.QUICK_SEARCH_FIELDS.length > 0 && search_term) {
            this.QUICK_SEARCH_FIELDS.forEach((col) => {
                orConditions.push(`LOWER(${col}) LIKE ?`)
                params.push(`%${search_term}%`)
            })
        }

        if(conditions.length > 0 || orConditions.length > 0){
            baseQuery += ' WHERE '
            if (conditions.length > 0)
                baseQuery += conditions.join(' AND ')
            if (orConditions.length > 0)
                baseQuery += (conditions.length > 0 ? ' AND ' : '') + ('(' + orConditions.join(' OR ') + ')')
        }

        var rest = await mysql.createQuery({
            query: baseQuery,
            params
        })

        if(rest && rest.length > 0){
            return rest[0].total;
        }

        return 0;
    }

    static async totalRowBySQL(sql) {
        var rest = await mysql.createQuery({
            query: sql,
            params: []
        })

        if(rest && rest.length > 0){
            return rest[0].total;
        }

        return 0;
    }

    /**
     * Retrieves a single entry matching the passed ID
     * @param {Number} id - The entry ID
     */
    static async find(id) {
        return (await mysql.createQuery({
            query: `SELECT * FROM ?? WHERE ?? = ? LIMIT 1;`,
            params: [this.TABLE_NAME, this.PRIMARY_KEY, id]
        })).shift()
    }

    /**
     * Retrieves all entries on the extending class' table
     */
    static findAll(limit, offset, order) {
        let baseQuery = `SELECT * FROM ?? `
        let params = [this.TABLE_NAME]

        if (order != null && order.by != null && order.direction != null) {
            baseQuery += ` ORDER BY ?? `
            baseQuery += order.direction
            params.push(order.by)
        }

        if (limit != null && !isNaN(limit)) {
            baseQuery += " LIMIT ? "
            params.push(limit)
        }

        if (offset != null && !isNaN(offset)) {
            baseQuery += " OFFSET ? "
            params.push(offset)
        }

        return mysql.createQuery({
            query: baseQuery,
            params
        });
    }

    static findAllTransactional(connection, limit, offset, order) {
        let baseQuery = `SELECT * FROM ?? `
        let params = [this.TABLE_NAME]

        if (order != null && order.by != null && order.direction != null) {
            baseQuery += ` ORDER BY ?? `
            baseQuery += order.direction
            params.push(order.by)
        }

        if (limit != null && !isNaN(limit)) {
            baseQuery += " LIMIT ? "
            params.push(limit)
        }

        if (offset != null && !isNaN(offset)) {
            baseQuery += " OFFSET ? "
            params.push(offset)
        }

        return mysql.createQuery({
            query: baseQuery,
            params,
            connection
        });
    }

    /**
     * Find entries by their fields
     * @param {Object} columns - The columns to be query
     * @param {Object} fields - The fields to be matched
     * @param {Object} limit - Limits the amount of returned entries
     * @param {Object} offset - offset the amount of returned entries
     * @param {Object} order - Orders the returned entries using a provided field
     */
    static findByFields({columns, fields, limit, offset, order}) {
        
        let baseQuery = columns.length > 0 ? `SELECT DISTINCT ${columns.join(',')} FROM ?? ` : `SELECT * FROM ?? `

        let params = [this.TABLE_NAME]
        let conditions = []

        if (fields) {
            Object.keys(fields).forEach((key) => {
                if (key == 'quick_search') return
                if(Array.isArray(fields[key])){
                    conditions.push(`${key} IN (?)`)
                    params.push(fields[key])
                } else {
                    conditions.push(`${key} = ?`)
                    params.push(fields[key])
                }
            })
        }

        let orConditions = []
        var search_term = fields['quick_search']
        if (this.QUICK_SEARCH_FIELDS && this.QUICK_SEARCH_FIELDS.length > 0 && search_term) {
            this.QUICK_SEARCH_FIELDS.forEach((col) => {
                orConditions.push(`LOWER(${col}) LIKE ?`)
                params.push(`%${search_term}%`)
            })
        }

        if(conditions.length > 0 || orConditions.length > 0){
            baseQuery += ' WHERE '
            if (conditions.length > 0)
                baseQuery += conditions.join(' AND ')
            if (orConditions.length > 0)
                baseQuery += (conditions.length > 0 ? ' AND ' : '') + ('(' + orConditions.join(' OR ') + ')')
        }

        if (order != null && order.by != null && order.direction != null) {
            baseQuery += ` ORDER BY ?? `
            baseQuery += order.direction
            params.push(order.by)
        }

        if (limit != null && !isNaN(limit)) {
            baseQuery += " LIMIT ?"
            params.push(limit)
        }

        if (offset != null && !isNaN(offset)) {
            baseQuery += " OFFSET ?"
            params.push(offset)
        }

        return mysql.createQuery({
            query: baseQuery,
            params
        })
    }

    /**
     * Find entries by their fields
     * @param {Object} baseQuery - The base query
     * @param {Object} fields - The fields to be matched
     * @param {Object} limit - Limits the amount of returned entries
     * @param {Object} offset - offset the amount of returned entries
     * @param {Object} order - Orders the returned entries using a provided field
     */
    static findByFields2({baseQuery, groupQuery, alias, fields, limit, offset, order}) {
        let params = []
        let conditions = []

        if (fields) {
            Object.keys(fields).forEach((key) => {
                if (key == 'quick_search') return
                if(Array.isArray(fields[key])){
                    conditions.push(`${alias}${key} IN (?)`)
                    params.push(fields[key])
                } else {
                    conditions.push(`${alias}${key} = ?`)
                    params.push(fields[key])
                }
            })
        }

        let orConditions = []
        var search_term = fields['quick_search']
        if (this.QUICK_SEARCH_FIELDS && this.QUICK_SEARCH_FIELDS.length > 0 && search_term) {
            this.QUICK_SEARCH_FIELDS.forEach((col) => {
                orConditions.push(`LOWER(${alias}${col}) LIKE ?`)
                params.push(`%${search_term}%`)
            })
        }

        if(conditions.length > 0 || orConditions.length > 0){
            baseQuery += ' WHERE '
            if (conditions.length > 0)
                baseQuery += conditions.join(' AND ')
            if (orConditions.length > 0)
                baseQuery += (conditions.length > 0 ? ' AND ' : '') + ('(' + orConditions.join(' OR ') + ')')
        }

        if (groupQuery != null) {
            baseQuery += groupQuery
        }

        if (order != null && order.by != null && order.direction != null) {
            baseQuery += ` ORDER BY ?? `
            baseQuery += order.direction
            params.push(order.by)
        }

        if (limit != null && !isNaN(limit)) {
            baseQuery += " LIMIT ?"
            params.push(limit)
        }

        if (offset != null && !isNaN(offset)) {
            baseQuery += " OFFSET ?"
            params.push(offset)
        }

        return mysql.createQuery({
            query: baseQuery,
            params
        })
    }

    static executeQuery({columns, where}) {
        let baseQuery = columns && columns.length > 0 ? `SELECT ${columns.join(',')} FROM ?? WHERE ` : `SELECT * FROM ?? WHERE `
        baseQuery += where
        let params = [this.TABLE_NAME]
        return mysql.createQuery({
            query: baseQuery,
            params
        })
    }

    static executeQueryString(sqlString, params = null) {
        if(params) {
            for (const [key, value] of Object.entries(params)) {
                sqlString = sqlString.replace(new RegExp(`:${key}`, 'g'), value);
            }
        }
        return mysql.createQuery({
            query: sqlString,
            params: []
        })
    }

    static executeQueryString2(sqlString, params = null) {
        return mysql.createQuery({
            query: sqlString,
            params
        })
    }

    static executeTransactionalQueryString(connection, sqlString, params = null) {
        if(params) {
            for (const [key, value] of Object.entries(params)) {
                sqlString = sqlString.replace(new RegExp(`:${key}`, 'g'), value);
            }
        }
        return mysql.createTransactionalQuery({
            query: sqlString,
            params: [],
            connection
        })
    }


    /**
     * Updates an entry
     * @param {MySQL.Connection} connection - The connection which will do the update. It should be immediatelly released unless in a transaction
     * @param {Object} data - The data fields which will be updated
     * @param {Number} id - The ID of the entry to be updated
     */
    static update(connection, {data, id}) {
        Object.keys(data).forEach(key => data[key] === undefined ? delete data[key] : {});

        return mysql.createTransactionalQuery({
            query: `UPDATE ??
                    SET ?
                    WHERE ?? = ?;`,
            params: [this.TABLE_NAME, data, this.PRIMARY_KEY, id],
            connection
        })
    }

    static updateByField(connection, {data, fields}) {
        Object.keys(data).forEach(key => data[key] === undefined ? delete data[key] : {});
        let baseQuery = `UPDATE ${this.TABLE_NAME} SET ? WHERE `
        let conditions = []
        let params = [data]
        fields.forEach((key) => {
            conditions.push(`${key} = ?`)
            params.push(data[key])
        })

        if(conditions.length > 0){
            baseQuery += conditions.join(' AND ')
        }
        return mysql.createTransactionalQuery({
            query: baseQuery,
            params,
            connection
        })
    }

    /**
     * Inserts a new entry
     * @param {MySQL.Connection} connection - The connection which will do the insert. It should be immediatelly released unless in a transaction
     * @param {Object} data - The fields which will populate the new entry
     */
    static insert(connection, {data}) {
        return mysql.createTransactionalQuery({
            query: `INSERT INTO ${this.TABLE_NAME}
                    SET ?;`,
            params: [data],
            connection
        })
    }

    /**
     * Deletes an entry
     * @param {MySQL.Connection} connection - The connection which will do the deletion. It should be immediatelly released unless in a transaction
     * @param {Number} id - The ID of the entry to be deleted
     */
    static delete(connection, {id}) {
        return mysql.createTransactionalQuery({
            query: `DELETE FROM  ??
                    WHERE ?? = ?;`,
            params: [this.TABLE_NAME,this.PRIMARY_KEY, id],
            connection
        })
    }

    static deleteMultiple(connection, {ids}) {
        return mysql.createTransactionalQuery({
            query: `DELETE FROM  ??
                    WHERE ?? IN (?);`,
            params: [this.TABLE_NAME,this.PRIMARY_KEY, ids],
            connection
        })
    }

    static deleteByFields(connection, {fields}) {
        
        let baseQuery =`DELETE FROM ?? WHERE `

        let params = [this.TABLE_NAME]
        let conditions = []

        Object.keys(fields).forEach((key) => {
            if(Array.isArray(fields[key])){
                conditions.push(`${key} IN (?)`)
                params.push(fields[key])
            }
            else {
                conditions.push(`${key} = ?`)
                params.push(fields[key])
            }
        })

        if(conditions.length > 0){
            baseQuery += conditions.join(' AND ')
        }

        return mysql.createTransactionalQuery({
            query: baseQuery,
            params,
            connection
        })
    }
}

module.exports = DAO