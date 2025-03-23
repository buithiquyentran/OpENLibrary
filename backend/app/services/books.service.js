const { ObjectId, ReturnDocument } = require("mongodb");

class BookService {
  constructor(client) {
    this.Book = client.db().collection("SACH");
  }
  //Dinh nghia cac phuong thuc truy xuat CSDL
  extractBookData(payload) {
    const book = {
      TEN_SACH: payload.TEN_SACH,
      DON_GIA: payload.DON_GIA,
      SO_QUYEN_SAN_CO: payload.SO_QUYEN_SAN_CO || payload.SO_QUYEN,
      SO_QUYEN: payload.SO_QUYEN,
      NAM_XUAT_BAN: payload.NAM_XUAT_BAN,
      TAC_GIA: payload.TAC_GIA,
      IMG: payload.IMG,
      MA_NXB: payload.MA_NXB,
    };
    // Remove undefined fields
    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );
    return book;
  }

  async create(payload) {
    const book = this.extractBookData(payload);
    if (book.MA_NXB) {
      book.MA_NXB = new ObjectId(book.MA_NXB);
    }
    const result = await this.Book.insertOne(book);
    return result;
  }
  async find() {
    const result = await this.Book.aggregate([
      {
        $lookup: {
          from: "NHAXUATBAN", // Bảng nhà xuất bản
          localField: "MA_NXB",
          foreignField: "_id",
          as: "nxb_info",
        },
      },
      {
        $unwind: "$nxb_info", // Chuyển mảng thành object
      },
      {
        $project: {
          TEN_SACH: 1,
          DON_GIA: 1,
          SO_QUYEN: 1,
          SO_QUYEN_SAN_CO: 1,
          NAM_XUAT_BAN: 1,
          TAC_GIA: 1,
          IMG: 1,
          MA_NXB: 1,
          NXB: {
            TEN_NXB: "$nxb_info.TEN_NXB",
            DIA_CHI: "$nxb_info.DIA_CHI",
          },
        },
      },
    ]).toArray();

    return result;
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(new RegExp(name)), $options: "i" }, // bieu thuc chinh quy, khong phan biet hoa thuong
    });
  }

  async findById(id) {
    const result = await this.Book.aggregate([
      {
        $match: { _id: new ObjectId(id) }, // Lọc theo ID
      },
      {
        $lookup: {
          from: "NHAXUATBAN", // Bảng chứa sách
          localField: "MA_NXB",
          foreignField: "_id",
          as: "nxb_info", // Kết quả gom vào mảng sach_info
        },
      },

      {
        $unwind: "$nxb_info", // Chuyển mảng thành object
      },

      {
        $project: {
          TEN_SACH: 1,
          DON_GIA: 1,
          SO_QUYEN: 1,
          SO_QUYEN_SAN_CO: 1,
          NAM_XUAT_BAN: 1,
          TAC_GIA: 1,
          IMG: 1,

          NXB: {
            TEN_NXB: "$nxb_info.TEN_NXB",
            DIA_CHI: "$nxb_info.DIA_CHI",
          },
        },
      },
    ]).toArray();

    return result;
  }
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractBookData(payload);
    if (update.MA_NXB) {
      update.MA_NXB = new ObjectId(update.MA_NXB);
    }
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

  async deleteAll() {
    const result = await this.Book.deleteMany({});
    return result.deletedCount;
  }
  async decreaseQuantity(id) {
    if (!ObjectId.isValid(id)) {
      return null; // Trả về null nếu ID không hợp lệ
    }
    const filter = { _id: new ObjectId(id) };
    const update = { $inc: { SO_QUYEN_SAN_CO: -1 } }; // Giảm SO_QUYEN_SAN_CO đi 1

    const result = await this.Book.findOneAndUpdate(
      filter,
      update,
      { returnDocument: "after" } // Trả về sách sau khi cập nhật
    );

    return result;
  }
  async increaseQuantity(id) {
    if (!ObjectId.isValid(id)) {
      return null; // Trả về null nếu ID không hợp lệ
    }
    const filter = { _id: new ObjectId(id) };
    const update = { $inc: { SO_QUYEN_SAN_CO: +1 } }; // Tăng SO_QUYEN_SAN_CO đi 1
 
    const result = await this.Book.findOneAndUpdate(filter, update, {
      returnDocument: "after",
    });

    return result;
  }
}
module.exports = BookService;
