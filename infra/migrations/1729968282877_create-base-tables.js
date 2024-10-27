// Start of Selection
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = async (pgm) => {
  pgm.createType("restriction_type", [
    "religious",
    "lifestyle",
    "allergen",
    "dietary",
    "health",
    "other",
  ]);
  pgm.createType("establishment_type", [
    "supermarket",
    "drugstore",
    "natural_store",
    "restaurant",
    "cafe",
    "bakery",
    "industry",
    "other",
  ]);

  await pgm.createTable("users", {
    id: {
      type: "uuid",
      default: pgm.func("gen_random_uuid()"),
      notNull: true,
      primaryKey: true,
    },

    name: {
      type: "varchar(255)",
      notNull: true,
      unique: true,
    },

    // Why 254 in length? https://stackoverflow.com/a/1199238
    email: {
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },

    // Why 60 varchar? https://forums.phpfreaks.com/topic/293405-recommended-sql-datatype-for-bcrypt-hash/#comment-1500831
    password: {
      type: "varchar(60)",
      notNull: true,
    },

    features: {
      type: "varchar[]",
      notNull: true,
      default: `{}`,
    },

    // Why "with timezone"? https://stackoverflow.com/a/20713587
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },

    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
  });

  pgm.createTable("company", {
    id: {
      type: "uuid",
      default: pgm.func("gen_random_uuid()"),
      notNull: true,
      primaryKey: true,
    },

    parent_id: {
      type: "uuid",
      notNull: false,
    },

    name: {
      type: "varchar",
      check: "length(name) <= 256",
      notNull: true,
      unique: true,
    },

    description: {
      type: "text",
      check: "length(description) <= 20000",
      notNull: true,
    },

    status: {
      type: "varchar",
      default: "draft",
      notNull: true,
      check: "status IN ('draft', 'published')",
    },

    owner_id: {
      type: "uuid",
      notNull: true,
    },

    slug: {
      type: "varchar",
      check: "length(slug) <= 256",
      notNull: true,
    },

    address: {
      type: "text",
      check: "length(address) <= 1000",
      notNull: true,
    },

    founded_at: {
      type: "timestamp with time zone",
      notNull: false,
    },

    company_type: {
      type: "establishment_type",
      notNull: true,
    },

    published_by_id: {
      type: "uuid",
      notNull: false,
    },

    published_at: {
      type: "timestamp with time zone",
      notNull: false,
    },

    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },

    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
  });

  await pgm.addConstraint(
    "company",
    "company_uniqueness_fkey",
    'UNIQUE ("owner_id", "slug")',
  );

  pgm.createTable("product", {
    id: {
      type: "uuid",
      default: pgm.func("gen_random_uuid()"),
      notNull: true,
      primaryKey: true,
    },

    name: {
      type: "varchar",
      check: "length(name) <= 256",
      notNull: true,
      unique: true,
    },

    description: {
      type: "text",
      check: "length(description) <= 20000",
      notNull: true,
    },

    company_id: {
      type: "uuid",
      notNull: true,
    },

    status: {
      type: "varchar",
      default: "draft",
      notNull: true,
      check: "status IN ('draft', 'published')",
    },

    published_by_id: {
      type: "uuid",
      notNull: false,
    },

    published_at: {
      type: "timestamp with time zone",
      notNull: false,
    },

    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },

    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
  });

  // Adding foreign key constraint for company_id in product table
  pgm.addConstraint("product", "product_company_id_fkey", {
    foreignKeys: {
      columns: "company_id",
      references: "company(id)",
      onDelete: "CASCADE",
    },
  });

  pgm.createTable("ingredient", {
    id: {
      type: "uuid",
      default: pgm.func("gen_random_uuid()"),
      notNull: true,
      primaryKey: true,
    },

    name: {
      type: "varchar",
      check: "length(name) <= 256",
      notNull: true,
      unique: true,
    },

    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },

    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
  });

  pgm.createTable("restriction", {
    id: {
      type: "uuid",
      default: pgm.func("gen_random_uuid()"),
      notNull: true,
      primaryKey: true,
    },

    name: {
      type: "varchar",
      check: "length(name) <= 256",
      notNull: true,
      unique: true,
    },

    type: {
      type: "restriction_type[]",
      notNull: true,
    },

    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },

    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
  });

  pgm.createTable("ingredient_restriction", {
    ingredient_id: {
      type: "uuid",
      notNull: true,
    },

    restriction_id: {
      type: "uuid",
      notNull: true,
    },

    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },

    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
  });

  pgm.addConstraint("ingredient_restriction", "ingredient_restriction_pkey", {
    primaryKey: ["ingredient_id", "restriction_id"],
  });

  pgm.addConstraint(
    "ingredient_restriction",
    "ingredient_restriction_ingredient_id_fkey",
    {
      foreignKeys: {
        columns: "ingredient_id",
        references: "ingredient(id)",
        onDelete: "CASCADE",
      },
    },
  );

  pgm.addConstraint(
    "ingredient_restriction",
    "ingredient_restriction_restriction_id_fkey",
    {
      foreignKeys: {
        columns: "restriction_id",
        references: "restriction(id)",
        onDelete: "CASCADE",
      },
    },
  );

  pgm.createTable("product_restriction", {
    product_id: {
      type: "uuid",
      notNull: true,
    },

    restriction_id: {
      type: "uuid",
      notNull: true,
    },

    is_cross_contamination: {
      type: "boolean",
      notNull: true,
      default: false,
    },

    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },

    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
  });

  pgm.addConstraint("product_restriction", "product_restriction_pkey", {
    primaryKey: ["product_id", "restriction_id"],
  });

  pgm.addConstraint(
    "product_restriction",
    "product_restriction_product_id_fkey",
    {
      foreignKeys: {
        columns: "product_id",
        references: "product(id)",
        onDelete: "CASCADE",
      },
    },
  );

  pgm.addConstraint(
    "product_restriction",
    "product_restriction_restriction_id_fkey",
    {
      foreignKeys: {
        columns: "restriction_id",
        references: "restriction(id)",
        onDelete: "CASCADE",
      },
    },
  );

  pgm.createIndex("ingredient_restriction", [
    "ingredient_id",
    "restriction_id",
  ]);
  pgm.createIndex("product_restriction", ["product_id", "restriction_id"]);

  pgm.createTable("product_restriction_vote", {
    id: {
      type: "uuid",
      default: pgm.func("gen_random_uuid()"),
      notNull: true,
      primaryKey: true,
    },
    product_id: {
      type: "uuid",
      notNull: true,
    },
    restriction_id: {
      type: "uuid",
      notNull: true,
    },
    user_id: {
      type: "uuid",
      notNull: true,
    },
    vote: {
      type: "smallint",
      notNull: true,
      check: "vote IN (-1, 1)",
    },
    created_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
    updated_at: {
      type: "timestamp with time zone",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
  });

  pgm.addConstraint(
    "product_restriction_vote",
    "product_restriction_vote_product_restriction_fkey",
    {
      foreignKeys: {
        columns: ["product_id", "restriction_id"],
        references: "product_restriction(product_id, restriction_id)",
        onDelete: "CASCADE",
      },
    },
  );

  pgm.addConstraint(
    "product_restriction_vote",
    "product_restriction_vote_user_id_fkey",
    {
      foreignKeys: {
        columns: "user_id",
        references: "users(id)",
        onDelete: "CASCADE",
      },
    },
  );

  pgm.addConstraint(
    "product_restriction_vote",
    "product_restriction_vote_unique",
    {
      unique: ["product_id", "restriction_id", "user_id"],
    },
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = async (pgm) => {
  await pgm.dropTable("product_restriction_vote", { cascade: true });
  await pgm.dropTable("product_restriction", { cascade: true });
  await pgm.dropTable("ingredient_restriction", { cascade: true });
  await pgm.dropTable("product", { cascade: true });
  await pgm.dropTable("ingredient", { cascade: true });
  await pgm.dropTable("restriction", { cascade: true });
  await pgm.dropTable("company", { cascade: true });
  await pgm.dropTable("users", { cascade: true });

  await pgm.dropType("establishment_type");
  await pgm.dropType("restriction_type");
};
