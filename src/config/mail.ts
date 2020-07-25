interface IMailConfig {
  driver: 'ethereal';
  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'oi@mandoubem.com.br',
      name: 'Equipe MandouBem',
    },
  },
} as IMailConfig;
