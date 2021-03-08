const WeeksService = {
    getAllWeeks(knex) {
        return knex.select('*').from('weeks');
    },
    getById(knex, id) {
        return knex.from('weeks').select('*').where('id', id).first()
    },
    insertWeek(knex, newWeek) {
        return knex
            .insert(newWeek)
            .into('weeks')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    deleteWeek(knex, id) {
        return knex('weeks')
            .where({id})
            .delete()
    },
    updateWeek(knex, id, newWeek) {
        return knex('weeks')
        .where({ id })
        .update(newWeekFields)
    },
}
      
module.exports = WeeksService;