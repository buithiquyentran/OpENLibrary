const { ObjectId, ReturnDocument } = require("mongodb");

class StaffService {
  constructor(client) {
    this.Staff = client.db().collection("NHANVIEN");
  }
  //Dinh nghia cac phuong thuc truy xuat CSDL
  extractStaffData(payload) {
    const staff = {
      HOTEN_NV: payload.HOTEN_NV,
      PASSWORD: payload.PASSWORD,
      CHUCVU: payload.CHUCVU,
      DIACHI: payload.DIACHI,
      SODIENTHOAI: payload.SODIENTHOAI,
    };
    // Remove undefined fields
    Object.keys(staff).forEach(
      (key) => staff[key] === undefined && delete staff[key]
    );
    return staff;
  }

  async create(payload) {
    const staff = this.extractStaffData(payload);
    const result = await this.Staff.insertOne(staff);
    return result;
  }
  async find(filter) {
    const cursor = await this.Staff.find(filter);
    return await cursor.toArray();
  }
  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(new RegExp(name)), $options: "i" }, // bieu thuc chinh quy, khong phan biet hoa thuong
    });
  }
  async findById(id) {
    return await this.Staff.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractStaffData(payload);
    const result = await this.Staff.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    // console.log(result);
    return result;
  }
  async delete(id) {
    const result = await this.Staff.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
  async findFavorite() {
    return await this.find({ favorite: true });
  }
  async deleteAll() {
    const result = await this.Staff.deleteMany({});
    return result.deletedCount;
  } 
}
module.exports = StaffService;
