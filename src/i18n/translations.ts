export type Language = 'pt' | 'en';

const pt = {
  /* ── common ── */
  loading:          'Carregando...',
  version:          'Versão',
  save:             'Salvar',
  cancel:           'Cancelar',
  delete:           'Excluir',
  edit:             'Editar',
  createdOn:        'Criado em',

  /* ── greeting ── */
  goodMorning:      'Bom dia',
  goodAfternoon:    'Boa tarde',
  goodEvening:      'Boa noite',

  /* ── header ── */
  openMenu:         'Abrir menu',
  closeMenu:        'Fechar menu',
  myProfile:        'Meu Perfil',
  signOut:          'Sair',

  /* ── sidebar ── */
  nav_dashboard:    'Dashboard',
  nav_audit:        'Auditoria',
  nav_settings:     'Configurações',

  /* ── dashboard ── */
  dash_subtitle:          'Visão geral do sistema de auditorias em campo',
  dash_newReport:         'Novo Relatório',
  dash_viewReports:       'Ver Relatórios',
  dash_exportPDF:         'Exportar PDF',
  dash_settings:          'Configurações',
  dash_newDesc:           'Iniciar uma nova inspeção em campo',
  dash_viewDesc_zero:     'Nenhum relatório cadastrado',
  dash_viewDesc_one:      'relatório cadastrado',
  dash_viewDesc_many:     'relatórios cadastrados',
  dash_exportDesc:        'Baixar relatórios em PDF',
  dash_settingsDesc:      'Ajustar preferências do sistema',
  dash_chartTitle:        'Relatórios por Mês',
  dash_chartSub:          'Últimos 6 meses',
  dash_recentTitle:       'Relatórios Recentes',
  dash_recentSub:         'Últimas inspeções',
  dash_viewAll:           'Ver todos',
  dash_noReports:         'Nenhum relatório ainda',
  dash_createFirst:       'Criar primeiro relatório',
  dash_suppliersTitle:    'Principais Fornecedores',
  dash_suppliersSub:      'Por número de inspeções',
  dash_noData:            'Sem dados',

  /* ── auditoria ── */
  aud_title:          'Relatórios de Inspeção',
  aud_subtitle:       'Gerencie e crie relatórios de inspeção em campo',
  aud_newReport:      'Novo Relatório',
  aud_searchPlaceholder: 'Buscar por item, pedido, local ou fornecedor…',
  aud_dateFilterTitle:   'Filtrar por data de inspeção',
  aud_results_one:    'resultado',
  aud_results_many:   'resultados',
  aud_emptyTitle:     'Nenhum relatório ainda',
  aud_noResultTitle:  'Nenhum resultado encontrado',
  aud_emptyDesc:      'Crie seu primeiro relatório de inspeção para começar',
  aud_noResultDesc:   'Tente ajustar os filtros ou o termo de busca',
  aud_createFirstBtn: 'Criar Primeiro Relatório',
  aud_exportPDF:      'Exportar como PDF',
  aud_editReport:     'Editar relatório',
  aud_deleteReport:   'Excluir relatório',
  aud_createdOn:      'Criado em',

  /* ── settings ── */
  set_title:          'Configurações',
  set_subtitle:       'Personalize o comportamento do sistema',
  set_resetBtn:       'Restaurar padrão',
  set_saveBtn:        'Salvar',
  set_saved:          'Configurações salvas com sucesso!',
  set_resetConfirm:   'Restaurar todas as configurações para o padrão?',
  set_general:        'Geral',
  set_language:       'Idioma',
  set_languageDesc:   'Idioma da interface do sistema',
  set_dateFormat:     'Formato de data',
  set_dateFormatDesc: 'Como as datas são exibidas',
  set_compactCards:   'Cards compactos',
  set_compactDesc:    'Exibir relatórios em modo compacto na listagem',
  set_reports:        'Relatórios',
  set_defaultUnit:    'Unidade padrão',
  set_unitDesc:       'Unidade usada nos registros dimensionais',
  set_defaultPine:    'Tipo de pinho padrão',
  set_pineDesc:       'Pré-selecionado ao criar novo relatório',
  set_pdfLogo:        'Logo no PDF',
  set_pdfLogoDesc:    'Exibir logo no cabeçalho dos PDFs exportados',
  set_about:          'Sobre o Sistema',

  /* ── profile ── */
  prof_title:         'Meu Perfil',
  prof_subtitle:      'Gerencie suas informações pessoais',
  prof_accountInfo:   'Informações da Conta',
  prof_editProfile:   'Editar Perfil',
  prof_security:      'Segurança',
  prof_saveChanges:   'Salvar Alterações',
};

const en: typeof pt = {
  /* ── common ── */
  loading:          'Loading...',
  version:          'Version',
  save:             'Save',
  cancel:           'Cancel',
  delete:           'Delete',
  edit:             'Edit',
  createdOn:        'Created on',

  /* ── greeting ── */
  goodMorning:      'Good morning',
  goodAfternoon:    'Good afternoon',
  goodEvening:      'Good evening',

  /* ── header ── */
  openMenu:         'Open menu',
  closeMenu:        'Close menu',
  myProfile:        'My Profile',
  signOut:          'Sign out',

  /* ── sidebar ── */
  nav_dashboard:    'Dashboard',
  nav_audit:        'Audit',
  nav_settings:     'Settings',

  /* ── dashboard ── */
  dash_subtitle:          'Overview of the field audit management system',
  dash_newReport:         'New Report',
  dash_viewReports:       'View Reports',
  dash_exportPDF:         'Export PDF',
  dash_settings:          'Settings',
  dash_newDesc:           'Start a new field inspection',
  dash_viewDesc_zero:     'No reports registered',
  dash_viewDesc_one:      'registered report',
  dash_viewDesc_many:     'registered reports',
  dash_exportDesc:        'Download reports as PDF',
  dash_settingsDesc:      'Adjust system preferences',
  dash_chartTitle:        'Reports by Month',
  dash_chartSub:          'Last 6 months',
  dash_recentTitle:       'Recent Reports',
  dash_recentSub:         'Latest inspections',
  dash_viewAll:           'View all',
  dash_noReports:         'No reports yet',
  dash_createFirst:       'Create first report',
  dash_suppliersTitle:    'Top Suppliers',
  dash_suppliersSub:      'By number of inspections',
  dash_noData:            'No data',

  /* ── auditoria ── */
  aud_title:          'Inspection Reports',
  aud_subtitle:       'Manage and create field inspection reports',
  aud_newReport:      'New Report',
  aud_searchPlaceholder: 'Search by item, order, location or supplier…',
  aud_dateFilterTitle:   'Filter by inspection date',
  aud_results_one:    'result',
  aud_results_many:   'results',
  aud_emptyTitle:     'No reports yet',
  aud_noResultTitle:  'No results found',
  aud_emptyDesc:      'Create your first inspection report to get started',
  aud_noResultDesc:   'Try adjusting the filters or search term',
  aud_createFirstBtn: 'Create First Report',
  aud_exportPDF:      'Export as PDF',
  aud_editReport:     'Edit report',
  aud_deleteReport:   'Delete report',
  aud_createdOn:      'Created on',

  /* ── settings ── */
  set_title:          'Settings',
  set_subtitle:       'Customize system behavior',
  set_resetBtn:       'Reset defaults',
  set_saveBtn:        'Save',
  set_saved:          'Settings saved successfully!',
  set_resetConfirm:   'Reset all settings to default?',
  set_general:        'General',
  set_language:       'Language',
  set_languageDesc:   'System interface language',
  set_dateFormat:     'Date format',
  set_dateFormatDesc: 'How dates are displayed',
  set_compactCards:   'Compact cards',
  set_compactDesc:    'Display reports in compact mode in the listing',
  set_reports:        'Reports',
  set_defaultUnit:    'Default unit',
  set_unitDesc:       'Unit used in dimensional records',
  set_defaultPine:    'Default pine type',
  set_pineDesc:       'Pre-selected when creating a new report',
  set_pdfLogo:        'PDF logo',
  set_pdfLogoDesc:    'Show logo in the header of exported PDFs',
  set_about:          'About the System',

  /* ── profile ── */
  prof_title:         'My Profile',
  prof_subtitle:      'Manage your personal information',
  prof_accountInfo:   'Account Information',
  prof_editProfile:   'Edit Profile',
  prof_security:      'Security',
  prof_saveChanges:   'Save Changes',
};

export const translations: Record<Language, typeof pt> = { pt, en };
export type TranslationKey = keyof typeof pt;
