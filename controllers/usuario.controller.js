const bcrypt = require("bcrypt");
const Usuario = require("../models/usuario.model");
const logger = require("../utils/logger");

exports.register = async (req, res, next) => {
  try {
    const { nome, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await new Usuario({ nome, email, password: hash }).save();
    res.status(201).json({ id: user._id, nome: user.nome, email: user.email });
  } catch (err) {
    logger.logError(err);
    if (err.code === 11000)
      err = { status: 400, message: "Email já cadastrado." };
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ email });
    if (!user) throw { status: 400, message: "Credenciais inválidas." };
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw { status: 400, message: "Credenciais inválidas." };
    req.session.userId = user._id;
    res.json({ message: "Login bem‑sucedido." });
  } catch (err) {
    logger.logError(err);
    next(err);
  }
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.json({ message: "Logout realizado." });
  });
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await Usuario.findById(req.session.userId).select("-password");
    if (!user) throw { status: 404, message: "Usuário não encontrado." };
    res.json(user);
  } catch (err) {
    logger.logError(err);
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { nome, email } = req.body;
    const updated = await Usuario.findByIdAndUpdate(
      req.session.userId,
      { nome, email },
      { new: true, runValidators: true, context: "query" }
    ).select("-password");
    if (!updated) throw { status: 404, message: "Usuário não encontrado." };
    res.json(updated);
  } catch (err) {
    logger.logError(err);
    next(err);
  }
};

exports.deleteAccount = async (req, res, next) => {
  try {
    await Usuario.findByIdAndDelete(req.session.userId);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.json({ message: "Conta excluída com sucesso." });
    });
  } catch (err) {
    logger.logError(err);
    next(err);
  }
};
