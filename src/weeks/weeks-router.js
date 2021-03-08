const path = require('path')
const express = require('express')
const logger = require('../logger')
const WeeksService = require('./weeks-service.js')
const { getWeekValidationError } = require('./weeks-validator')
const xss = require('xss')

const weeksRouter = express.Router()
const bodyParser = express.json()

const serializeWeek = week => ({
    id: week.id,
    name: xss(week.name)
});

weeksRouter
    .route('/')
    .get((req, res, next) => {
        WeeksService.getAllWeeks(req.app.get('db'))
        .then(weeks => {
            res.json(weeks.map(serializeWeek))
        })
        .catch(next)
    })

    .post(bodyParser, (req, res, next) => {
        const { name } = req.body
        const newWeek = { name };

    for (const field of ['name']) {
        if (!newWeek[field]) {
            logger.error(`${field} is required`)
            return res.status(400).send({
                error: { message: `'${field}' is required` }
            })
        }
    }

    const error = getWeekValidationError(newWeek)

    if (error) return res.status(400).send(error)

    WeeksService.insertWeek(
        req.app.get('db'),
        newWeek
    )
        .then(week => {
            logger.info(`Week with id ${week.id} created`)
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `${week.id}`))
                .json(serializeWeek(week))
        })
        .catch(next);
    });

    weeksRouter
        .route('/:week_id')
        .all((req, res, next) => {
            WeeksService.getById(req.app.get('db'), req.params.week_id)
                .then(week => {
                    if (!week) {
                        return res.status(404).json({
                            error: { message: 'Week Not Found!'}
                        })
                    }
                    res.week = week;
                    next();
                })
                .catch(next);
        })
        .get((req, res, next) => {
            res.json(serializeWeek(res.week));
        })
        .delete((req, res, next) => {
            WeeksService.deleteWeek(req.app.get('db'), req.params.week_id)
            .then(numRowsAffected => {
                res.status(204).end();
            })
            .catch(next)
        })
        .patch(bodyParser, (req, res, next) => {
            const { name } = req.body;
            const weekToUpdate = { name }

            const numberOfValues = Object.values(weekToUpdate).filter(Boolean).length
            if (numberOfValues === 0) {
                logger.error(`Invalid without required field`)
                return res.status(400).json({
                    error: {
                        message: `Request body must contain name`
                    }
                })
            }
            const error = getWeekValidationError(weekToUpdate)
            if (error) return res.status(400).send(error)
    
            WeeksService.updateWeek(
                req.app.get('db'),
                req.params.week_id,
                weekToUpdate
            )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
            })
        
        module.exports = weeksRouter;