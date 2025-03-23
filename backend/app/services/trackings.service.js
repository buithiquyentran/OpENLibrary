const { ObjectId, ReturnDocument } = require("mongodb");

class TrackingService {
  constructor(client) {
    this.Tracking = client.db().collection("THEODOIMUONSACH");
  }
  //Dinh nghia cac phuong thuc truy xuat CSDL
  extractTrackingData(payload) {
    const tracking = {
      MASACH: payload.MASACH,
      MADOCGIA: payload.MADOCGIA,
      NGAYMUON: payload.NGAYMUON || new Date().toISOString().split("T")[0],
      NGAYTRA: payload.NGAYTRA,
    };

    // Remove undefined fields
    Object.keys(tracking).forEach(
      (key) => tracking[key] === undefined && delete tracking[key]
    );
    return tracking;
  }

  async create(payload) {
    const tracking = this.extractTrackingData(payload);

    // Chuyển các giá trị ID thành ObjectId nếu hợp lệ
    if (ObjectId.isValid(tracking.MASACH)) {
      tracking.MASACH = new ObjectId(tracking.MASACH);
    }
    if (ObjectId.isValid(tracking.MADOCGIA)) {
      tracking.MADOCGIA = new ObjectId(tracking.MADOCGIA);
    }
    const result = await this.Tracking.insertOne(tracking);
    return result;
  }

  // async find(filter) {
  //   const cursor = await this.Tracking.find(filter);
  //   return await cursor.toArray();
  // }
  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(new RegExp(name)), $options: "i" }, // bieu thuc chinh quy, khong phan biet hoa thuong
    });
  }

  async findByMaDocGia(MADOCGIA) {
    // return await this.Tracking.find({
    //   MADOCGIA: ObjectId.isValid(MADOCGIA) ? new ObjectId(MADOCGIA) : MADOCGIA,
    // }).toArray();
    const result = await this.Tracking.aggregate([
      {
        $match: {
          MADOCGIA: ObjectId.isValid(MADOCGIA)
            ? new ObjectId(MADOCGIA)
            : MADOCGIA,
        },
      },
      {
        $lookup: {
          from: "SACH", // Bảng chứa sách
          localField: "MASACH",
          foreignField: "_id",
          as: "sach_info", // Kết quả gom vào mảng sach_info
        },
      },
      {
        $lookup: {
          from: "DOCGIA",
          localField: "MADOCGIA",
          foreignField: "_id",
          as: "docgia_info",
        },
      },

      {
        $unwind: "$sach_info", // Chuyển mảng thành object
      },
      {
        $unwind: "$docgia_info",
      },

      {
        $project: {
          _id: 1,
          MASACH: 1,
          MADOCGIA: 1,
          NGAYMUON: 1,
          NGAYTRA: 1,
          SACH: {
            TEN_SACH: "$sach_info.TEN_SACH",
            TAC_GIA: "$sach_info.TAC_GIA",
          },
          DOCGIA: {
            HO_LOT: "$docgia_info.HO_LOT",
            TEN: "$docgia_info.TEN",
            USERNAME: "$docgia_info.USERNAME",
          },
        },
      },
    ]).toArray();

    return result;
  }
  async findById(id) {
    return await this.Tracking.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractTrackingData(payload);
    const result = await this.Tracking.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    // console.log(result);
    return result;
  }
  async delete(id) {
    const result = await this.Tracking.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
  async findFavorite() {
    return await this.find({ favorite: true });
  }
  async deleteAll() {
    const result = await this.Tracking.deleteMany({});
    return result.deletedCount;
  }
  async find() {
    const result = await this.Tracking.aggregate([
      // {
      //   $match: {
      //     NGAYTRA: null, // Lọc những sách chưa trả (tuỳ chỉnh nếu cần)
      //   },
      // },
      {
        $lookup: {
          from: "SACH", // Bảng chứa sách
          localField: "MASACH",
          foreignField: "_id",
          as: "sach_info", // Kết quả gom vào mảng sach_info
        },
      },
      {
        $lookup: {
          from: "DOCGIA",
          localField: "MADOCGIA",
          foreignField: "_id",
          as: "docgia_info",
        },
      },

      {
        $unwind: "$sach_info", // Chuyển mảng thành object
      },
      {
        $unwind: "$docgia_info",
      },

      {
        $project: {
          _id: 1,
          MASACH: 1,
          MADOCGIA: 1,
          NGAYMUON: 1,
          NGAYTRA: 1,
          SACH: {
            TEN_SACH: "$sach_info.TEN_SACH",
            TAC_GIA: "$sach_info.TAC_GIA",
          },
          DOCGIA: {
            HO_LOT: "$docgia_info.HO_LOT",
            TEN: "$docgia_info.TEN",
            USERNAME: "$docgia_info.USERNAME",
          },
        },
      },
    ]).toArray();

    return result;
  }
}
module.exports = TrackingService;
