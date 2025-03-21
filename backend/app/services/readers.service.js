const { ObjectId, ReturnDocument } = require("mongodb");

class ReaderService {
  constructor(client) {
    this.Reader = client.db().collection("DOCGIA");
  }
  //Dinh nghia cac phuong thuc truy xuat CSDL
  extractReaderData(payload) {
    const reader = {
      HO_LOT: payload.HO_LOT,
      TEN: payload.TEN,
      NGAY_SINH: payload.NGAY_SINH,
      PHAI: payload.PHAI,
      DIA_CHI: payload.DIA_CHI,
      SDTDG: payload.SDTDG,
      USERNAME: payload.USERNAME,
    };
    // Remove undefined fields
    Object.keys(reader).forEach(
      (key) => reader[key] === undefined && delete reader[key]
    );
    return reader;
  }

  async create(payload) {
    const reader = this.extractReaderData(payload);

    if (ObjectId.isValid(reader.USERNAME)) {
      reader.USERNAME = new ObjectId(reader.USERNAME);
    }
    const sdtExist = await this.Reader.findOne({ SDTDG: reader.SDTDG });
    if (sdtExist) throw new Error("SDT exist");

    const result = await this.Reader.insertOne(reader);
    return result;
  }
  async find(filter) {
    const cursor = await this.Reader.find(filter);
    return await cursor.toArray();
  }
  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(new RegExp(name)), $options: "i" }, // bieu thuc chinh quy, khong phan biet hoa thuong
    });
  }
  async findByUsername(USERNAME) {
    return await this.Reader.findOne({
      USERNAME: USERNAME, // bieu thuc chinh quy, khong phan biet hoa thuong
    });
  }
  async findById(id) {
    return await this.Reader.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractReaderData(payload);
    const result = await this.Reader.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    // console.log(result);
    return result;
  }
  async delete(id) {
    const result = await this.Reader.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
  async deleteByUsername(username) {
    const result = await this.Reader.findOneAndDelete({
      USERNAME: username ? username : null,
    });
    return result;
  }
  async findFavorite() {
    return await this.find({ favorite: true });
  }
  async deleteAll() {
    const result = await this.Reader.deleteMany({});
    return result.deletedCount;
  }
}
module.exports = ReaderService;
