const express = require('express');
const { PrismaClient, Prisma } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();
const autoCrudRouter = express.Router();

Prisma.dmmf.datamodel.models.forEach((modelMetadata) => {
  const modelName = modelMetadata.name;
  const modelCamel = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  const routeName = '/' + modelName.toLowerCase() + 's';

  const model = prisma[modelCamel];
  
  // Xác định Primary Key
  const pkFieldConf = modelMetadata.fields.find(f => f.isId);
  const pkField = pkFieldConf ? pkFieldConf.name : null;
  const hasCompositeId = modelMetadata.primaryKey && modelMetadata.primaryKey.fields.length > 0;

  // Lấy ra composite fields nếu có
  const compFields = modelMetadata.primaryKey ? modelMetadata.primaryKey.fields : [];

  // 1. GET ALL
  autoCrudRouter.get(routeName, authenticate, asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;
    
    // Loại bỏ page, limit để build WHERE clause
    const queryObj = { ...req.query };
    delete queryObj.page;
    delete queryObj.limit;

    // Ép kiểu number cho các field foreign key nếu cần
    const where = {};
    for (const key in queryObj) {
      if (!isNaN(queryObj[key])) {
        where[key] = Number(queryObj[key]);
      } else {
        where[key] = queryObj[key];
      }
    }

    const data = await model.findMany({ where, skip, take: limit });
    res.json({ data, page, limit });
  }));

  // 2. CREATE
  autoCrudRouter.post(routeName, authenticate, asyncHandler(async (req, res) => {
    const data = await model.create({
      data: req.body
    });
    res.status(201).json(data);
  }));

  // 3. GET BY ID / PUT / DELETE (cho Single PK)
  if (pkField && !hasCompositeId) {
    autoCrudRouter.get(`${routeName}/:id`, authenticate, asyncHandler(async (req, res) => {
      const data = await model.findUnique({
        where: { [pkField]: Number(req.params.id) } // assumes ID is Int. String IDs would need checking, but all our IDs are Int
      });
      if (!data) return res.status(404).json({ error: 'Not found' });
      res.json(data);
    }));

    autoCrudRouter.put(`${routeName}/:id`, authenticate, asyncHandler(async (req, res) => {
      const data = await model.update({
        where: { [pkField]: Number(req.params.id) },
        data: req.body
      });
      res.json(data);
    }));

    autoCrudRouter.delete(`${routeName}/:id`, authenticate, asyncHandler(async (req, res) => {
      await model.delete({
        where: { [pkField]: Number(req.params.id) }
      });
      res.json({ message: `${modelName} deleted successfully` });
    }));
  } 
  // 4. GET BY ID / PUT / DELETE (cho Composite PK)
  else if (hasCompositeId && compFields.length > 0) {
    // Để gọi update/delete với composite key qua URL REST, cần truyền cả 2 tham số.
    // VD: /api/crud/bookingdetails/:bookingId/:courtId
    const paramString = compFields.map(f => `:${f}`).join('/');
    
    autoCrudRouter.get(`${routeName}/${paramString}`, authenticate, asyncHandler(async (req, res) => {
      const whereCl = {};
      compFields.forEach(f => {
        whereCl[f] = Number(req.params[f]);
      });
      const data = await model.findUnique({ where: { [compFields.join('_')]: whereCl } });
      if (!data) return res.status(404).json({ error: 'Not found' });
      res.json(data);
    }));

    autoCrudRouter.put(`${routeName}/${paramString}`, authenticate, asyncHandler(async (req, res) => {
      const whereCl = {};
      compFields.forEach(f => {
        whereCl[f] = Number(req.params[f]);
      });
      const data = await model.update({
        where: { [compFields.join('_')]: whereCl },
        data: req.body
      });
      res.json(data);
    }));

    autoCrudRouter.delete(`${routeName}/${paramString}`, authenticate, asyncHandler(async (req, res) => {
      const whereCl = {};
      compFields.forEach(f => {
        whereCl[f] = Number(req.params[f]);
      });
      await model.delete({
        where: { [compFields.join('_')]: whereCl }
      });
      res.json({ message: `${modelName} deleted successfully` });
    }));
  }
});

module.exports = autoCrudRouter;
