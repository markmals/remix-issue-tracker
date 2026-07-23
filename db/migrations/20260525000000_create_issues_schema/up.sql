create table issues (
  id integer primary key,
  title text not null,
  area text not null,
  status text not null,
  author text not null,
  updated text not null,
  comments integer not null default 0,
  reactions integer not null default 0,
  active integer not null default 0,
  assignee text,
  milestone text,
  priority text,
  description text not null
);

create table comments (
  id integer primary key autoincrement,
  issueId integer not null,
  author text not null,
  time text,
  body text not null,
  constraint comments_issue_id_fk foreign key (issueId) references issues (id) on delete cascade
);

create index comments_issue_id_idx on comments (issueId);
