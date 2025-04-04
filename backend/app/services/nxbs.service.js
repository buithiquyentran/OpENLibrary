const { ObjectId, ReturnDocument } = require("mongodb");

class NXBService {
  constructor(client) {
    this.NXB = client.db().collection("NHAXUATBAN");
  }
  //Dinh nghia cac phuong thuc truy xuat CSDL
  extractNXBData(payload) {
    const NXB = {
      TEN_NXB: payload.TEN_NXB,
      DIA_CHI: payload.DIA_CHI,
    };
    // Remove undefined fields
    Object.keys(NXB).forEach(
      (key) => NXB[key] === undefined && delete NXB[key]
    );
    return NXB;
  }

  async create(payload) {
    const NXB = this.extractNXBData(payload);
    const result = await this.NXB.insertOne(NXB);
    return result;
  }
  async find(filter) {
    const cursor = await this.NXB.find(filter);
    return await cursor.toArray();
  }
  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(new RegExp(name)), $options: "i" }, // bieu thuc chinh quy, khong phan biet hoa thuong
    });
  }
  async findById(id) {
    return await this.NXB.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractNXBData(payload);
    const result = await this.NXB.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    console.log(result);
    return result;
  }
  async delete(id) {
    const result = await this.NXB.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
  async findFavorite() {
    return await this.find({ favorite: true });
  }
  async deleteAll() {
    const result = await this.NXB.deleteMany({});
    return result.deletedCount;
  }
}
module.exports = NXBService;
