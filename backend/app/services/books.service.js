const { ObjectId, ReturnDocument } = require("mongodb");

class BookService {
  constructor(client) {
    this.Book = client.db().collection("SACH");
  }
  //Dinh nghia cac phuong thuc truy xuat CSDL
  extractContactData(payload) {
    const book = {
      TEN_SACH: payload.TEN_SACH,
      DON_GIA: payload.DON_GIA,
      SO_QUYEN: payload.SO_QUYEN,
      NAM_XUAT_BAN: payload.NAM_XUAT_BAN,
      TAC_GIA: payload.TAC_GIA,
      MA_NXB: payload.MA_NXB,
    };
    // Remove undefined fields
    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );
    return book;
  }

  async create(payload) {
    const book = this.extractContactData(payload);
    if (book.MA_NXB) {
      book.MA_NXB = ObjectId(book.MA_NXB);
    }
    const result = await this.Book.insertOne(book);
    return result;
  }
  async find(filter) {
    const cursor = await this.Book.find(filter);
    return await cursor.toArray();
  }
  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(new RegExp(name)), $options: "i" }, // bieu thuc chinh quy, khong phan biet hoa thuong
    });
  }
  async findById(id) {
    return await this.Book.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractContactData(payload);
    const result = await this.Book.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    // console.log(result);
    return result;
  }
  async delete(id) {
    const result = await this.Book.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
  async findFavorite() {
    return await this.find({ favorite: true });
  }
  async deleteAll() {
    const result = await this.Book.deleteMany({});
    return result.deletedCount;
  }
}
module.exports = BookService;
