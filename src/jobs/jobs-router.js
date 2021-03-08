const path = require('path')
const express = require('express')
const xss = require('xss')
const logger = require('../logger')
const JobsService = require('./jobs-service.js')
const jobsRouter = express.Router()
const bodyParser = express.json()

const serializeJob = job => ({
    id: job.id,
    name: xss(job.name),
    modified: new Date(job.modified),
    content: xss(job.content),
    weekId: job.weekId,
    jobtitle: job.jobTitle,
    companyname: job.companyName,
    postedurl: job.postedUrl,
    interview: job.interview,
    jobrating: job.jobRating
});

jobsRouter
    .route('/')
    .get((req, res, next) => {
        JobsService.getAllJobs(req.app.get('db'))
        .then(jobs => {
            res.json(jobs.map(serializeJob));
        })
        .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { name, content, weekId } = req.body
        const newJob = { name, content, weekId  }

        for (const field of ['name', 'content', 'weekId']) {
            if (!newJob[field]) {
                logger.error(`${field} is required`)
                return res.status(400).send({
                    error: { message: `${field} is required!` }
                })
            }
        }
    JobsService.insertJob(
        req.app.get('db'),
        newJob
    )
        .then(job => {
            logger.info(`Bookmark with id ${job.id} created.`)
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `${job.id}`))
                .json(serializeJob(job))
        })
        .catch(next)
    })

    jobsRouter
    .route('/:job_id')

    .all((req, res, next) => {
        const { job_id } = req.params
        JobsService.getById(req.app.get('db'), job_id)
        .then(job => {
            if (!job) {
                logger.error(`Job with id ${job_id} not found`)
                return res.status(404).json({
                    error: { message: `Job Not Found` }
                })
            }
            res.job = job
            next()
        })
        .catch(next)
    })

    .get((req, res) => {
        res.json(serializeJob(res.job))
    })

    .delete((req, res, next) => {
        const { job_id } = req.params
        JobsService.deleteJob(
            req.app.get('db'),
            job_id
        )
            .then(numRowsAffected => {
                logger.info(`Job with id ${job_id} deleted.`)
                res.status(204).end()
            })
            .catch(next)
    })

    .patch(bodyParser, (req, res, next) => {
        const { name, content } = req.body;
        const updateJob = ( name, content )

        const numberOfValues = Object.values(updateJob).filter(Boolean).length
        if (numberOfValues === 0) {
            logger.error(`invalid update without required fields`)
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'name' or 'content'`
                }
            })
        }

        JobsService.updateJob(
            req.app.get('db'),
            req.params.job_id,
            updateJob
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = jobsRouter