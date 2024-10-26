const availableFeatures = new Set([
  // USER
  'create:user',
  'read:user',
  'read:user:self',
  'update:user',

  // MIGRATION
  'create:migration',
  'read:migration',

  // ACTIVATION_TOKEN
  'read:activation_token',

  // RECOVERY_TOKEN
  'read:recovery_token',

  // EMAIL_CONFIRMATION_TOKEN
  'read:email_confirmation_token',

  // SESSION
  'create:session',
  'read:session',

  // PRODUCT
  'create:product',
  'read:product',
  'read:product:list',
  'update:product',
  'delete:product',

  // COMPANY
  'create:company',
  'read:company',
  'read:company:list',
  'update:company',
  'delete:company',

  // MODERATION
  'read:user:list',
  'read:votes:others',
  'update:product:others',
  'update:company:others',
  'ban:user',
  'create:recovery_token:username',
  'read:firewall',
  'review:firewall',

  // BANNED
  'nuked',

  // ADVERTISEMENT
  'read:ad:list',
]);

export default Object.freeze(availableFeatures);
