import { randomUUID } from "node:crypto"

import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      console.log(req.query)
      const { search } = req.query

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      )

      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      if (req.body.title && req.body.description) {
        const { title, description } = req.body
        const task = {
          id: randomUUID(),
          title,
          description,
          completed_at: null,
          created_at: Date.now(),
          updated_at: Date.now(),
        }

        database.insert("tasks", task)
      } else {
        return res.writeHead(400).end("sem informaçoes")
      }

      return res.writeHead(201).end()
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params
      const info = req.body

      if (info) {
        database.update("tasks", id, info)
      } else {
        return res.writeHead(400).end("sem informaçoes")
      }

      console.log(req.params)
      return res.writeHead(204).end()
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params

      database.complete("tasks", id)
      console.log(req.params)
      return res.writeHead(204).end()
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params

      database.delete("tasks", id)
      console.log(req.params)
      return res.writeHead(204).end()
    },
  },
]
