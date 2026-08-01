const { AuditLog } =
require("../models");

class AuditService {

  async create(data) {

    return await AuditLog.create({

      user_id:
        data.user_id,

      action:
        data.action,

      module_name:
        data.module_name,

      method:
        data.method,

      endpoint:
        data.endpoint,

      ip_address:
        data.ip_address,

      old_data:
        data.old_data || null,

      new_data:
        data.new_data || null

    });

  }

}

module.exports =
new AuditService();