const { ObjectId, ReturnDocument } = require("mongodb");

class StaffService {
  constructor(client) {
    this.Staff = client.db().collection("NHANVIEN");
  }
  //Dinh nghia cac phuong thuc truy xuat CSDL
  extractStaffData(payload) {
    const staff = {
      HOTEN_NV: payload.HOTEN_NV,
      CHUCVU: payload.CHUCVU,
      DIACHI: payload.DIACHI,
      SDTNV: payload.SDTNV,
      USERNAME: payload.USERNAME,
    };
    // Remove undefined fields
    Object.keys(staff).forEach(
      (key) => staff[key] === undefined && delete staff[key]
    );
    return staff;
  }

  async create(payload) {
    const staff = this.extractStaffData(payload);

    const sdtExist = await this.Staff.findOne({ SDTNV: staff.SDTNV });
    if (sdtExist) throw new Error("SDT exist");

    if (ObjectId.isValid(staff.USERNAME)) {
      staff.USERNAME = new ObjectId(staff.USERNAME);
    }
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
  async findByUsername(USERNAME) {
    return await this.Staff.findOne({
      USERNAME: USERNAME, // bieu thuc chinh quy, khong phan biet hoa thuong
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
  async deleteById(id) {
    const result = await this.Staff.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
  async deleteByUsername(username) {
    const result = await this.Staff.findOneAndDelete({
      USERNAME: username ? username : null,
    });
    return result;
  }
  async deleteAll() {
    const result = await this.Staff.deleteMany({});
    return result.deletedCount;
  }
}
module.exports = StaffService;
