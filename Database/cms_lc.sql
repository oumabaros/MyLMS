USE [CMS]
GO
/****** Object:  UserDefinedFunction [dbo].[selectConcat]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[selectConcat]
(
    @str varchar(8000), @delim varchar(1) = ','
)
RETURNS @output table
(
	RowID int IDENTITY(1,1), 
	val varchar(8000)
) 
begin
	--declare @str varchar(8000)='TX_whatever_20210901.pdf _-', @delim varchar(1) = ' '
	declare @insVal varchar(8000) = ''
	declare @ix int = 1
	
	while @ix <= len(@str) begin		
		if substring(@str, @ix, 1) = @delim begin
			insert into @output(val) select @insval
			select @insval = ''
			select @ix = @ix + 1
		end else if @ix <= len(@str) begin
			select @insVal = @insVal + substring(@str, @ix, 1)
			select @ix = @ix + 1
		end
	end

	insert into @output(val) select @insval

	return		
end
GO
/****** Object:  Table [dbo].[QuestionLinesTmp]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QuestionLinesTmp](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[UID] [int] NOT NULL,
	[QuizID] [int] NOT NULL,
	[SortNo] [int] NULL,
	[SectionNo] [int] NULL,
	[SectionName] [varchar](1000) NULL,
	[QuestionID] [int] NULL,
	[Question] [varchar](1000) NULL,
	[Answer1] [varchar](1000) NULL,
	[Answer2] [varchar](1000) NULL,
	[Answer3] [varchar](1000) NULL,
	[Answer4] [varchar](1000) NULL,
	[CorrectAnswer] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QuestionTags]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QuestionTags](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[QuestionID] [int] NOT NULL,
	[Tag] [varchar](100) NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[DTCreated] [datetime] NOT NULL,
	[Active] [bit] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QuizAnswers]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QuizAnswers](
	[AnswerID] [int] IDENTITY(1,1) NOT NULL,
	[TryID] [varchar](100) NOT NULL,
	[UID] [int] NOT NULL,
	[QuestionID] [int] NOT NULL,
	[Answer] [varchar](1000) NULL,
	[DTCreated] [datetime] NOT NULL,
	[Active] [bit] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QuizBody]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QuizBody](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[QuizID] [int] NOT NULL,
	[SectionNo] [int] NOT NULL,
	[SectionName] [varchar](100) NULL,
	[SortNo] [int] NOT NULL,
	[QuestionID] [int] NOT NULL,
	[DTCreated] [datetime] NOT NULL,
	[Active] [bit] NOT NULL,
	[createdBy] [int] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QuizQuestionMaterial]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QuizQuestionMaterial](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[QuizID] [int] NOT NULL,
	[SectionNo] [int] NOT NULL,
	[URL] [varchar](1000) NULL,
	[Explanation] [varchar](1000) NULL,
	[Filename] [varchar](1000) NULL,
	[FileData] [varbinary](max) NULL,
	[CreatedBy] [int] NOT NULL,
	[DTCreated] [datetime] NOT NULL,
	[Active] [bit] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QuizQuestions]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QuizQuestions](
	[QuestionID] [int] IDENTITY(1,1) NOT NULL,
	[Question] [varchar](1000) NOT NULL,
	[Answer1] [varchar](1000) NULL,
	[Answer2] [varchar](1000) NULL,
	[Answer3] [varchar](1000) NULL,
	[Answer4] [varchar](1000) NULL,
	[CorrectAnswer] [int] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[DTCreated] [datetime] NOT NULL,
	[Active] [bit] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QuizScores]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QuizScores](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[UID] [int] NOT NULL,
	[QuizID] [int] NOT NULL,
	[SectionNo] [int] NOT NULL,
	[TryID] [varchar](100) NOT NULL,
	[QuizTotal] [int] NOT NULL,
	[QuizCorrect] [int] NOT NULL,
	[SectionTotal] [int] NOT NULL,
	[SectionCorrect] [int] NOT NULL,
	[DTCreated] [datetime] NOT NULL,
	[Active] [bit] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[QuizTry]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[QuizTry](
	[AnswerID] [int] IDENTITY(1,1) NOT NULL,
	[TryID] [varchar](100) NOT NULL,
	[UID] [int] NOT NULL,
	[QuestionID] [int] NOT NULL,
	[Answer] [varchar](1000) NULL,
	[DTCreated] [datetime] NOT NULL,
	[Active] [bit] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Quizzes]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Quizzes](
	[QuizID] [int] IDENTITY(1,1) NOT NULL,
	[QuizName] [varchar](300) NOT NULL,
	[QuizType] [varchar](50) NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[OwnerCID] [int] NOT NULL,
	[DTCreated] [datetime] NOT NULL,
	[Active] [bit] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[UID] [int] NOT NULL,
	[CID] [int] NOT NULL,
	[UserName] [varchar](400) NOT NULL,
	[UserRole] [varchar](20) NOT NULL,
	[DTCreated] [datetime] NOT NULL,
	[Active] [bit] NOT NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[QuestionTags] ADD  DEFAULT (getdate()) FOR [DTCreated]
GO
ALTER TABLE [dbo].[QuestionTags] ADD  DEFAULT ((1)) FOR [Active]
GO
ALTER TABLE [dbo].[QuizAnswers] ADD  DEFAULT (newid()) FOR [TryID]
GO
ALTER TABLE [dbo].[QuizAnswers] ADD  DEFAULT (getdate()) FOR [DTCreated]
GO
ALTER TABLE [dbo].[QuizAnswers] ADD  DEFAULT ((1)) FOR [Active]
GO
ALTER TABLE [dbo].[QuizBody] ADD  DEFAULT ((0)) FOR [SectionNo]
GO
ALTER TABLE [dbo].[QuizBody] ADD  DEFAULT (getdate()) FOR [DTCreated]
GO
ALTER TABLE [dbo].[QuizBody] ADD  DEFAULT ((1)) FOR [Active]
GO
ALTER TABLE [dbo].[QuizQuestionMaterial] ADD  DEFAULT (getdate()) FOR [DTCreated]
GO
ALTER TABLE [dbo].[QuizQuestionMaterial] ADD  DEFAULT ((1)) FOR [Active]
GO
ALTER TABLE [dbo].[QuizQuestions] ADD  DEFAULT (getdate()) FOR [DTCreated]
GO
ALTER TABLE [dbo].[QuizQuestions] ADD  DEFAULT ((1)) FOR [Active]
GO
ALTER TABLE [dbo].[QuizScores] ADD  DEFAULT (getdate()) FOR [DTCreated]
GO
ALTER TABLE [dbo].[QuizScores] ADD  DEFAULT ((1)) FOR [Active]
GO
ALTER TABLE [dbo].[QuizTry] ADD  DEFAULT (newid()) FOR [TryID]
GO
ALTER TABLE [dbo].[QuizTry] ADD  DEFAULT (getdate()) FOR [DTCreated]
GO
ALTER TABLE [dbo].[QuizTry] ADD  DEFAULT ((1)) FOR [Active]
GO
ALTER TABLE [dbo].[Quizzes] ADD  DEFAULT ('Standard') FOR [QuizType]
GO
ALTER TABLE [dbo].[Quizzes] ADD  DEFAULT (getdate()) FOR [DTCreated]
GO
ALTER TABLE [dbo].[Quizzes] ADD  DEFAULT ((1)) FOR [Active]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT (getdate()) FOR [DTCreated]
GO
ALTER TABLE [dbo].[Users] ADD  DEFAULT ((1)) FOR [Active]
GO
/****** Object:  StoredProcedure [dbo].[LC_AddQuestionsToSections]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LC_AddQuestionsToSections]
@uid int,
@quizid int,
@sectionno int,
@sectionname varchar(100),
@questionid int

AS
BEGIN
	declare @cid int = (select cid from Users where UID=@uid)
	declare @return_val int
	declare @sortno int

	set @sortno=(select max(SortNo) from QuizBody q 
	join Users u on u.UID=q.CreatedBy where q.SectionName=@sectionname and q.QuizID=@quizid and q.Active=1 and u.CID=@cid)
	
	insert into QuizBody(QuizId,SectionNo,SectionName,SortNo,QuestionID,DTCreated,Active,createdBy)
	values(@quizid,@sectionno,@sectionname,isnull(@sortno,0)+100,@questionid,getdate(),1,@uid)
	set @return_val=SCOPE_IDENTITY()
	select @return_val as 'Status'
END
GO
/****** Object:  StoredProcedure [dbo].[LC_AddQuestionsToStandardQuiz]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LC_AddQuestionsToStandardQuiz]
@uid int,
@quizid int,
@questionid int

AS
BEGIN
	declare @cid int = (select cid from Users where UID=@uid)
	declare @return_val int
	declare @sortno int=(select max(sortno) from QuizBody where QuizID=@quizid) 
	
	insert into QuizBody(QuizID,SectionNo,SectionName,SortNo,QuestionID,DTCreated,Active,createdBy) 
	values(@quizid,1,'',isnull(@sortno,0)+100,@questionid,getdate(),1,@uid)
	set @return_val=SCOPE_IDENTITY()
	select @return_val as 'Status'
END
GO
/****** Object:  StoredProcedure [dbo].[LC_DeleteQuestionFromSection]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LC_DeleteQuestionFromSection]
@uid int,
@sectionname varchar(150),
@quizid int,
@sectionno int,
@sortno int,
@questionid int
AS
BEGIN
	set nocount off
	declare @cid int = (select cid from Users where UID=@uid)
	delete from QuizBody 
	where SectionName=@sectionname 
	and QuizID=@quizid 
	and SectionNo=@sectionno 
	and SortNo=@sortno 
	and QuestionID=@questionid
	and Active=1

	select @@ROWCOUNT as 'Status'
END
GO
/****** Object:  StoredProcedure [dbo].[LC_DeleteQuestionsFromStandardQuiz]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LC_DeleteQuestionsFromStandardQuiz]
@uid int,
@quizid int,
@sortno int,
@questionid int

AS
BEGIN
	declare @cid int = (select cid from Users where UID=@uid)
	delete from QuizBody where QuizID=@quizid and QuestionID=@questionid and SortNo=@sortno
	select @@ROWCOUNT as 'Status'
END
GO
/****** Object:  StoredProcedure [dbo].[LC_DeleteQuiz]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create procedure [dbo].[LC_DeleteQuiz]
	@uid int, @quizid int
as begin
	declare @cid int = (select cid from users where uid=@uid)

	update Quizzes set active=0 where QuizID=@quizid
	select 'done' as msg
end
GO
/****** Object:  StoredProcedure [dbo].[LC_GetAllQuestions]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LC_GetAllQuestions]
@uid int
AS
BEGIN
	declare @cid int = (select cid from Users where UID=@uid)
	select * 
	from QuizQuestions qq 
	join Users u on u.UID=qq.CreatedBy
	where u.CID=@cid 
END
GO
/****** Object:  StoredProcedure [dbo].[LC_GetHeartbeat]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[LC_GetHeartbeat]
	@uid int
as begin
	select *, newid() as SecureCode from users where uid=@uid
end
GO
/****** Object:  StoredProcedure [dbo].[LC_GetMaxSortNo]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LC_GetMaxSortNo]
@uid int,
@sectionname varchar(100),
@quizid int
AS
BEGIN
	declare @cid int = (select cid from Users where UID=@uid)
	select max(SortNo) as 'SortNo' from QuizBody q 
	join Users u on u.UID=q.CreatedBy
	where q.SectionName=@sectionname and q.QuizID=@quizid and q.Active=1 and u.CID=@cid 

	END
GO
/****** Object:  StoredProcedure [dbo].[LC_GetMyScores]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LC_GetMyScores]
@uid int,
@quizid int
AS
BEGIN
	declare @cid int = (select cid from Users where UID=@uid)
	select q.QuizID,q.QuizType,q.QuizName,case 
		when qs.QuizTotal <> qs.QuizCorrect then 'Incomplete'
		when qs.id is null then 'Not Taken'
		when qs.QuizTotal = qs.QuizCorrect then 'Passed'
		else 'NA' end as QuizStatus, qs.QuizTotal, qs.QuizCorrect,qs.DTCreated
	from Quizzes q
	left join (select quizid, max(id) id from QuizScores group by quizid) x on x.QuizID=q.QuizID
	left join QuizScores qs on qs.QuizID = q.QuizID and qs.UID=@uid and qs.id=x.id
	--left join QuizBody qb on qb.QuizID=q.QuizID
	where q.OwnerCID = @cid and q.active=1 and q.QuizID=@quizid
	order by qs.DTCreated desc
END
GO
/****** Object:  StoredProcedure [dbo].[LC_GetQuiz]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[LC_GetQuiz]
	@uid int, @quizid int
as begin
	/*
	declare @uid int = 11, @quizid int=60
	begin
	--*/
	declare @cid int = (select cid from users where uid=@uid)
	declare @TryID varchar(100) = newid()

	select distinct qb.SortNo,
		q.QuizID, q.QuizName, q.QuizType, qq.QuestionID, qq.Question, 
		qq.Answer1, qq.Answer2, qq.Answer3, qq.Answer4, qq.CorrectAnswer, 
		qb.SectionNo, qb.SectionName, 
		case when qqm.URL is not null then qqm.URL
			 when qqm.Explanation is not null then qqm.Explanation
			 when qqm.Filename is not null then qqm.filename
			 else null end as Material,
		case when qqm.URL is not null then 'URL'
			 when qqm.Explanation is not null then 'Explanation'
			 when qqm.Filename is not null then 'File'
			 else null end as MaterialType,
		qqm.FileData as MaterialData,
		qqm.Filename as Files,
		@TryID as TryID
	from Quizzes q
	join QuizBody qb on qb.QuizID = q.QuizID and qb.Active=1
	join QuizQuestions qq on qq.QuestionID = qb.QuestionID and qq.active=1
	left join QuizQuestionMaterial qqm on qqm.QuizID=q.QuizID and qqm.SectionNo=qb.SectionNo and qqm.Active=1
	where q.OwnerCID=@cid and q.quizid=@quizid and q.Active=1
	order by qb.SortNo
end
GO
/****** Object:  StoredProcedure [dbo].[LC_GetQuizBodyByQuiz]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LC_GetQuizBodyByQuiz]
@uid int,
@quizid int
AS
BEGIN
	declare @cid int = (select cid from Users where UID=@uid)
	select qb.*
	from QuizBody qb 
	--join Users u on u.CID=@cid
	where qb.QuizId=@quizid and qb.SectionName is not null and qb.Active=1 --and u.CID=@cid

END
GO
/****** Object:  StoredProcedure [dbo].[LC_GetQuizzes]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[LC_GetQuizzes]
	@uid int
as begin
	--declare @uid int = 11 begin
	declare @cid int = (select cid from users where uid=@uid)

	select q.*, case 
		when qs.QuizTotal <> qs.QuizCorrect then 'Incomplete'
		when qs.id is null then 'Not Taken'
		when qs.QuizTotal = qs.QuizCorrect then 'Passed'
		else 'NA' end as QuizStatus, qs.QuizTotal, qs.QuizCorrect,
		x.id
	from Quizzes q
	left join (select quizid, max(id) id from QuizScores where uid=@uid group by quizid, uid) x on x.QuizID=q.QuizID
	left join QuizScores qs on qs.QuizID = q.QuizID and qs.UID=@uid and qs.id=x.id
	where q.OwnerCID = @cid and q.active=1 
	order by q.QuizName

end
GO
/****** Object:  StoredProcedure [dbo].[LC_GetSectionQuestions]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LC_GetSectionQuestions]
@uid int,
@sectionname varchar(150),
@quizid int
AS
BEGIN
	declare @cid int = (select cid from Users where UID=@uid)
	select qq.*, 'Included'=0,'SortNo'=null
	from QuizQuestions qq 
	join Users u on u.UID=qq.CreatedBy
	where u.CID=@cid and qq.Active=1
	and qq.QuestionID not in
	(
	select qb.QuestionID from QuizBody qb 
	join Users u on u.UID=qb.createdBy
	where qb.QuizID=@quizid and qb.SectionName=@sectionname 
	and qb.SectionName is not null and qb.Active=1
	and u.CID=@cid
	)
	union 
	select qq.*,'Included'=1,qb.SortNo from QuizBody qb 
	join QuizQuestions qq on qq.QuestionID=qb.QuestionID
	join Users u on u.UID=qb.createdBy
	where qb.QuizID=28 and qb.SectionName=@sectionname
	and qb.SectionName is not null and qb.Active=1
	and u.CID=@cid
	order by qq.QuestionID

END
GO
/****** Object:  StoredProcedure [dbo].[LC_GetSections]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LC_GetSections]
@uid int,
@quizid int
AS
BEGIN
	declare @cid int = (select cid from Users where UID=@uid)
	select distinct qb.SectionName,qb.SectionNo,
	(select max(SortNo) from QuizBody q 
	join Users u on u.UID=q.CreatedBy
	where q.SectionName=qb.SectionName and q.QuizID=@quizid and q.Active=1 and u.CID=@cid 
	) as 'SortNo'
	from QuizBody qb 
	join Quizzes qz on qz.QuizID=qb.QuizID
	where qb.QuizId=@quizid and qb.SectionName is not null and qb.Active=1 and qz.OwnerCID=@cid

END
GO
/****** Object:  StoredProcedure [dbo].[LC_GetStandardQuizQuestions]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[LC_GetStandardQuizQuestions]
	@uid int,
	@quizid int
as begin
	--declare @uid int = 11 begin
	declare @cid int = (select cid from users where uid=@uid)
	
	select qq.*,'Included'=0,'SortNo'=null 
	from QuizQuestions qq
	where qq.QuestionID not in
	(
	select qb.QuestionID from QuizBody qb
	join Users u on u.CID=@cid
	where u.CID=@cid and qb.QuizID= @quizid and qb.Active=1
	)
	union
	select qq.*,'Included'=1,qb.SortNo from QuizBody qb 
	join QuizQuestions qq on qq.QuestionID=qb.QuestionID
	join Users u on u.CID=@cid
	where qb.QuizID=@quizid and qb.Active=1	and u.CID=@cid
	
	order by qq.QuestionID
end
GO
/****** Object:  StoredProcedure [dbo].[LC_GetTries]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LC_GetTries]
	@UID int, @xUID int, @quizid int
AS BEGIN
	--declare @UID int=11, @xUID int = 12, @quizid int = 62 begin
	declare @cid int = (select cid from Users where UID=@uid)
	declare @isAdmin bit = 0
	select @isAdmin = 1 from Users where uid=@uid and UserRole='Admin' and active=1
	select @xUID = 0 where @UID <> @xUID and @isAdmin = 0

	select a.*,  
		case 
			when c.QuizTotal <> c.QuizCorrect then 'Incomplete'
			when c.id is null then 'Not Taken'
			when c.QuizTotal = c.QuizCorrect then 'Passed'
			else 'NA' 
		end as QuizStatus
	from (
		select distinct
			qs.UID, q.QuizID, q.QuizName, qb.SectionNo, qb.SectionName, 
			qs.TryID, convert(varchar, qs.dtcreated, 101) as TryDate,
			qs.DTCreated as TryDT,
			case 
			when qs.SectionTotal <> qs.SectionCorrect then 'Incomplete'
			when qs.id is null then 'Not Taken'
			when qs.SectionTotal = qs.SectionCorrect then 'Passed'
			else 'NA' 
		end as SectionStatus
		from Quizzes q
		join QuizBody qb on q.QuizID=qb.QuizID and qb.active=1
		join QuizQuestions qq on qb.QuestionID = qq.QuestionID and qq.active=1
		join QuizScores qs on qs.quizid = q.QuizID and qs.SectionNo = qb.SectionNo and qs.active=1
		where q.QuizID=@quizid and q.Active=1 and q.OwnerCID=@cid
		and qs.UID=@xUID
	) a
	join (
		select max(id) id, quizid, tryid, uid from quizscores group by QuizID, TryID, UID
	) b on a.QuizID = b.QuizID and a.TryID = b.TryID and a.UID = b.UID
	join QuizScores c on b.id = c.id
	order by TryDT desc, TryID
END
GO
/****** Object:  StoredProcedure [dbo].[LC_GetTryScore]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LC_GetTryScore]
@uid int,
@tryid varchar(150)
AS
BEGIN
  declare @cid int = (select cid from Users where UID=@uid)

	DECLARE @IDList TABLE (ID INT)
	INSERT INTO @IDList 
	select 
	qt.QuestionID
	from  
	QuizTry qt
	join QuizQuestions qq on qq.QuestionID=qt.QuestionID
	where qt.TryID=@tryid

	DECLARE @Ids INTEGER
	DROP TABLE IF EXISTS tempdb.dbo.#tmp
	CREATE TABLE #tmp
	  (
	   QuestionID          INT,
	   TryID             varchar(150),
	   Question             varchar(max),
	   Answer               varchar(max),
	   Correct              varchar(max)
	   )
	WHILE EXISTS (SELECT * FROM @IDList)
	BEGIN
	SELECT @Ids = Min(ID) FROM @IDList
	declare @a as varchar(50); 
	declare @b as int; 
	declare @sql nvarchar(max)
	declare @ans as varchar(max)
	DECLARE @Results TABLE (ResultText VARCHAR(500));

	set @b=(select CorrectAnswer from QuizQuestions where QuestionID=@Ids)
	set @a='Answer'+ cast(@b as varchar(50))

	set @sql = 'select [' + replace(@a, '''', '''''') + '] from QuizQuestions where QuestionID='+cast(@Ids as varchar(50))

	INSERT INTO @Results EXECUTE SP_EXECUTESQL @sql

	set @ans=(select ResultText from @Results) ;
	insert into #tmp(QuestionID,TryID,Question,Answer,Correct)
	select 
	qt.QuestionID,qt.TryID,qq.Question,qt.Answer,@ans

	from  
	QuizTry qt
	join QuizQuestions qq on qq.QuestionID=qt.QuestionID
	where qt.TryID=@tryid and qq.QuestionID=@Ids
	DELETE FROm @Results
	DELETE FROM @IDList WHERE ID = @Ids
	END
	select QuestionID,TryID,Question,Answer,Correct,case
	when Answer <> Correct then 'Failed'
		
			when Answer = Correct then 'Passed'
			end as TryStatus
	from #tmp

	drop table #tmp
END
GO
/****** Object:  StoredProcedure [dbo].[LC_GetUpdateMaterial]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[LC_GetUpdateMaterial]
	@uid int, @QuizID int, @SectionNo int = 0, @URL varchar(100) = '',@FileName varchar(100) = ''
as begin
	/*
	declare @uid int = 11, @QuizID int=29, @SectionNo int = 0, @URL varchar(100) = ''
	begin
	--*/
	declare @cid int = (select cid from users where uid=@uid)
	declare @affected_records int

	if (@SectionNo > 0 and @URL <> '' and @FileName<>'') 
		begin
			if (select id from QuizQuestionMaterial where QuizID=@QuizID and SectionNo=@SectionNo and active=1) is null begin
				insert into QuizQuestionMaterial(QuizID, SectionNo, URL, CreatedBy,Filename)
				select @QuizID, @SectionNo, @URL, @uid,@FileName
				set @affected_records=@@ROWCOUNT
				--select 'insert'
			end else begin
				update qqm set url=@URL,Filename=@FileName
				from QuizBody qb 
				join QuizQuestionMaterial qqm on qb.QuizID=qqm.QuizID and qb.SectionNo = qqm.SectionNo and qqm.Active=1
				where qb.quizid=@QuizID and qb.active=1 and qb.SectionNo=@SectionNo
				set @affected_records=@@ROWCOUNT
				--select 'update'
			end
		end
	
	if ((@SectionNo > 0 and @URL = '' and @FileName='') ) 
		begin
			update qqm set url=null
			from QuizBody qb 
			join QuizQuestionMaterial qqm on qb.QuizID=qqm.QuizID and qb.SectionNo = qqm.SectionNo and qqm.Active=1
			where qb.quizid=@QuizID and qb.active=1 and qb.SectionNo=@SectionNo
			set @affected_records=@@ROWCOUNT
		end

	if ((@SectionNo > 0 and @URL <> '' and @FileName='') ) 
		begin
			update qqm set url=@URL
			from QuizBody qb 
			join QuizQuestionMaterial qqm on qb.QuizID=qqm.QuizID and qb.SectionNo = qqm.SectionNo and qqm.Active=1
			where qb.quizid=@QuizID and qb.active=1 and qb.SectionNo=@SectionNo
			set @affected_records=@@ROWCOUNT
		end

	if ((@SectionNo > 0 and @URL = '' and @FileName<>'') ) 
		begin
			update qqm set Filename=@FileName,URL=null
			from QuizBody qb 
			join QuizQuestionMaterial qqm on qb.QuizID=qqm.QuizID and qb.SectionNo = qqm.SectionNo and qqm.Active=1
			where qb.quizid=@QuizID and qb.active=1 and qb.SectionNo=@SectionNo
			set @affected_records=@@ROWCOUNT
		end

	select distinct qb.QuizID, qb.SectionNo, qb.SectionName,@affected_records as AffectedRecords, 
		case when qqm.URL is null then '' else qqm.URL end as URL,
		case when qqm.Filename is null then '' else qqm.Filename end as FileName
	from QuizBody qb 
	left join QuizQuestionMaterial qqm on qb.QuizID=qqm.QuizID and qb.SectionNo = qqm.SectionNo and qqm.Active=1
	where qb.quizid=@QuizID and qb.active=1

end
GO
/****** Object:  StoredProcedure [dbo].[LC_GetUserExamTries]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LC_GetUserExamTries]
@uid int,
@quizid int,
@user_id int
AS
BEGIN
	declare @cid int = (select cid from Users where UID=@user_id)
	select qs.TryId, convert(varchar, dtcreated, 101) as TryDate,
	case 
		when qs.SectionTotal <> qs.SectionCorrect then 'Incomplete'
		when qs.id is null then 'Not Taken'
		when qs.SectionTotal = qs.SectionCorrect then 'Passed'
		else 'NA' 
	end as QuizStatus
	from QuizScores qs where qs.UID=@user_id and qs.QuizID=@quizid
END
GO
/****** Object:  StoredProcedure [dbo].[LC_GetUsers]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LC_GetUsers]
@uid int
AS
BEGIN
	declare @cid int = (select cid from Users where UID=@uid)
	select * from Users u 
	where u.Active=1 and u.CID=@cid 
END
GO
/****** Object:  StoredProcedure [dbo].[LC_GetUserTries]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LC_GetUserTries]
@uid int,
@user_id int
AS
BEGIN
	declare @cid int = (select cid from Users where UID=@user_id)
	select qs.TryId, convert(varchar, dtcreated, 101) as TryDate,
	case 
		when qs.SectionTotal <> qs.SectionCorrect then 'Incomplete'
		when qs.id is null then 'Not Taken'
		when qs.SectionTotal = qs.SectionCorrect then 'Passed'
		else 'NA' 
	end as QuizStatus
	from QuizScores qs where qs.UID=@user_id 
	order by DTCreated desc
END
GO
/****** Object:  StoredProcedure [dbo].[LC_LogUser]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[LC_LogUser]
	@uid int, @cid int, @username varchar(400), @userrole varchar(20)
as begin
	
	if (select id from users where uid=@uid and cid=@cid) is null
		insert into users(uid, cid, username, userrole) select @uid, @cid, @username, @userrole
	else 
		update users set username=@username, userrole=@userrole where uid=@uid and cid=@cid

	select 'done' as msg
end
GO
/****** Object:  StoredProcedure [dbo].[LC_QuestionLineAddTmp]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE procedure [dbo].[LC_QuestionLineAddTmp]
	@uid int, 
	@QuizID int,
	@SortNo int,
	@SectionNo int,
	@SectionName varchar(1000),
	@QuestionID int,
	@Question varchar(1000),
	@Answer1 varchar(1000),
	@Answer2 varchar(1000),
	@Answer3 varchar(1000),
	@Answer4 varchar(1000),
	@CorrectAnswer int,
	@deleteAll bit
as begin
	delete QuestionLinesTmp where uid=@uid and @deleteAll = 1

	insert into QuestionLinesTmp(uid, QuizID, sortno, SectionNo, SectionName, QuestionID, Question, 
		Answer1, Answer2, Answer3, Answer4, CorrectAnswer)
	select @uid, @QuizID, @SortNo, @SectionNo, @SectionName, @QuestionID, @Question,
		@Answer1, @Answer2, @Answer3, @Answer4, @CorrectAnswer

	 select distinct * from QuestionLinesTmp where uid=@uid order by SortNo
end
GO
/****** Object:  StoredProcedure [dbo].[LC_QuestionLineRemove]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[LC_QuestionLineRemove]
	@uid int, @quizid int, @sortno int
as begin
	declare @questionid int = (
		select questionid 
		from QuestionLinesTmp 
		where uid=@uid and quizid=@quizid and SortNo=@sortno)

	update QuizBody set Active=0 where quizid=@quizid and QuestionID=@questionid
	delete QuestionLinesTmp where uid=@uid and SortNo=@sortno

	declare @id int, @ix int = 0
	declare cur cursor for
		select id from QuestionLinesTmp where uid=@uid order by SortNo
	open cur
	fetch next from cur into @id
	while @@FETCH_STATUS = 0 begin
		update QuestionLinesTmp set sortno = @ix where id=@id
		set @ix = @ix + 100
		fetch next from cur into @id
	end
	close cur
	deallocate cur

	select * from QuestionLinesTmp where uid=@uid order by sortno
end
GO
/****** Object:  StoredProcedure [dbo].[LC_QuizScoreSET]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[LC_QuizScoreSET]
	@uid int, @QuizID int, @SectionNo int, @TryID varchar(100)
as begin
	--declare @uid int=11, @QuizID int=62, @SectionNo int=1, @TryID varchar(100)='8D8988F9-CB3A-405C-8398-73867BF13AA2' begin
	declare @cid int = (select cid from users where uid=@uid)
	
	declare @QuizTotal int, @QuizCorrect int, @SectionTotal int, @SectionCorrect int

	select @SectionTotal = count(qq.QuestionID)
	from Quizzes q
	join QuizBody qb on qb.QuizID = q.QuizID and qb.active=1
	join QuizQuestions qq on qq.QuestionID = qb.QuestionID and qq.Active=1
	where q.QuizID=@QuizID and q.Active=1 and qb.SectionNo=@SectionNo

	select @QuizTotal = count(qq.QuestionID)
	from Quizzes q
	join QuizBody qb on qb.QuizID = q.QuizID and qb.active=1
	join QuizQuestions qq on qq.QuestionID = qb.QuestionID and qq.Active=1
	where q.QuizID=@QuizID and q.Active=1 --and qb.SectionNo=@SectionNo

	select @SectionCorrect = count(qt.AnswerID)
	from Quizzes q
	join QuizBody qb on qb.QuizID = q.QuizID and qb.active=1
	join QuizQuestions qq on qq.QuestionID = qb.QuestionID and qq.Active=1
	join QuizTry qt on qt.uid=@uid and qt.QuestionID = qq.QuestionID and qt.TryID=@TryID 
	where q.QuizID=@QuizID and q.Active=1 and qb.SectionNo=@SectionNo
	and qt.Answer = case qq.CorrectAnswer
		when 1 then qq.Answer1
		when 2 then qq.Answer2
		when 3 then qq.Answer3
		when 4 then qq.Answer4 end

	select @QuizCorrect = count(qt.AnswerID)
	from Quizzes q
	join QuizBody qb on qb.QuizID = q.QuizID and qb.active=1
	join QuizQuestions qq on qq.QuestionID = qb.QuestionID and qq.Active=1
	join QuizAnswers qt on qt.uid=@uid and qt.QuestionID = qq.QuestionID and qt.TryID=@TryID 
	where q.QuizID=@QuizID and q.Active=1 --and qb.SectionNo=@SectionNo
	and qt.Answer = case qq.CorrectAnswer
		when 1 then qq.Answer1
		when 2 then qq.Answer2
		when 3 then qq.Answer3
		when 4 then qq.Answer4 end


	if (select id from QuizScores where uid=@uid and QuizID=@QuizID and SectionNo=@SectionNo and TryID=@TryID) is null
		insert into QuizScores(UID, QuizID, SectionNo, TryID, QuizTotal, QuizCorrect, SectionTotal, SectionCorrect)
		select @uid, @QuizID, @SectionNo, @TryID, @QuizTotal, @QuizCorrect, @SectionTotal, @SectionCorrect
	else
		update QuizScores set QuizTotal=@QuizTotal, QuizCorrect=@QuizCorrect, SectionTotal=@SectionTotal, SectionCorrect=@SectionCorrect
		where uid=@uid and QuizID=@QuizID and SectionNo=@SectionNo and TryID=@TryID

	select @QuizID as QuizID, @SectionNo as SectionNo, @TryID as TryId, @SectionTotal as Total, @SectionCorrect as Correct,
		cast(case when @SectionCorrect = @SectionTotal then 1 else 0 end as bit) as PassedFailed,
		@QuizTotal, @QuizCorrect
end
GO
/****** Object:  StoredProcedure [dbo].[LC_SubmitAnswers]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[LC_SubmitAnswers]
	@uid int, @TryID varchar(100), @QuestionID int, @Answer varchar(1000), @sectionNo int
as begin
	declare @cid int = (select cid from users where uid=@uid)
	
	insert into QuizTry(TryID, UID, QuestionID, Answer)
	select @TryID, @uid, @QuestionID, @Answer
	
	if (select AnswerID from QuizAnswers where uid=@uid and QuestionID=@QuestionID) is null
		insert into QuizAnswers(TryID, UID, QuestionID, Answer)
		select @TryID, @uid, @QuestionID, @Answer
	else
		update QuizAnswers set TryID=@TryID, Answer=@Answer
		where uid=@uid and QuestionID=@QuestionID

	select 'Done' as msg
end
GO
/****** Object:  StoredProcedure [dbo].[LC_UpdateQuestions]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[LC_UpdateQuestions]
@uid int,
@questionid int,
@active bit
AS
BEGIN
	declare @cid int = (select cid from Users where UID=@uid)
	update QuizQuestions  set Active=@active
	where QuestionID=@questionid
	select @@ROWCOUNT as 'Status'
END
GO
/****** Object:  StoredProcedure [dbo].[LC_UpdateQuiz_Part1]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[LC_UpdateQuiz_Part1]
	@uid int, @QuizID int
as begin
	--declare @uid int = 11, @quizid int = 36 begin
	declare @cid int = (select cid from users where cid=@uid)
	
	create table #quiz(QuizID int)
	declare @id int, @quizname varchar(300) = (select quizname from Quizzes where quizid=@quizid)

	declare icur cursor for 
		select id from QuestionLinesTmp where uid=@uid and QuizID=@QuizID order by SortNo
	open icur
	fetch next from icur into @id
	while @@FETCH_STATUS = 0 begin
		declare @sortNo int, @tags varchar(8000), @questionid int, @question varchar(1000),
		@answer1 varchar(1000), @answer2 varchar(1000), @answer3 varchar(1000), @answer4 varchar(1000), 
		@correct varchar(10), @section varchar(1000), @material varchar(1000)

		--reset qlt questionid = 0 where question has changed
		update qlt set QuestionID=0
		from QuestionLinesTmp qlt
		join QuizQuestions qq on qlt.QuestionID=qq.QuestionID
			and (qlt.Question <> qq.question or qlt.Answer1 <> qq.Answer1 or qlt.Answer2 <> qq.Answer2
				or qlt.Answer3 <> qq.Answer3 or qlt.Answer4 <> qq.Answer4 or qlt.CorrectAnswer <> qq.CorrectAnswer)
		where qlt.id = @id

		--get variables from qlt and material
		select @sortNo=SortNo, @tags=tags, @questionid=QuestionID, @question=question, @answer1=Answer1, @answer2=Answer2, 
			@answer3=Answer3, @answer4=Answer4, @correct=Correct, @section=SectionName, @material=Material
		from (
			select top 1 qlt.SortNo, '' as tags, qlt.QuestionID, qlt.Question, qlt.Answer1, qlt.Answer2
				, qlt.Answer3, qlt.Answer4, cast(qlt.CorrectAnswer as varchar) as Correct, qlt.SectionName, 
				case when qqm.id is null then ''
					 when qqm.Explanation is not null then qqm.Explanation
					 when qqm.filename is not null then qqm.filename
					 when qqm.URL is not null then qqm.URL
					 else '' end as Material
			from QuestionLinesTmp qlt
			join QuizBody qb on qb.QuizID = qlt.QuizID and qb.Active=1
			left join QuizQuestionMaterial qqm on qlt.QuizID=qqm.QuizID and qqm.SectionNo=qb.SectionNo and qb.SectionName=qlt.SectionName
			where qlt.id=@id
		) x

		--newquizid begins with zero
		declare @newquizid int = (select top 1 quizid from #quiz)
		select @newquizid = 0 where @newquizid is null

		--uploads data and sets new quizid
		insert into #quiz(quizid)
		exec LC_UpdateQuiz_Part2 
			@uid, @sortNo, @quizname, @tags, @questionid, 
			@question, @answer1, @answer2, @answer3, @answer4, 
			@correct, @section, @material, @newquizid

		--select @uid, @sortNo, @quizname, @tags, @questionid, 
		--	@question, @answer1, @answer2, @answer3, @answer4, 
		--	@correct, @section, @material, @newquizid

		fetch next from icur into @id
	end
	close icur
	deallocate icur

	--set old quiz to inactive
	update quizzes set active=0 where quizid=@quizid
	select top 1 quizid from #quiz

	drop table #quiz
end
GO
/****** Object:  StoredProcedure [dbo].[LC_UpdateQuiz_Part2]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[LC_UpdateQuiz_Part2]
	@uid int, @ix int, @quizname varchar(300), @tags varchar(8000), @questionid int, @question varchar(1000), 
	@answer1 varchar(1000), @answer2 varchar(1000), @answer3 varchar(1000), @answer4 varchar(1000), 
	@correct varchar(1000), @section varchar(1000), @material varchar(1000), @quizid int = 0
as begin
	/* 
	declare @uid int=11, @ix int=0, @quizname varchar(300)='Outdoor Training 2', @tags varchar(8000)='', 
		@questionid int = 0, @question varchar(1000) = 'Test', 
		@answer1 varchar(1000)='Yes', @answer2 varchar(1000) = 'No', @answer3 varchar(1000)='', @answer4 varchar(1000)='', 
		@correct varchar(1000)='2', @section varchar(1000)='Knots', @material varchar(1000)='https://youtu.be/eJFxLzZepRY', 
		@quizid int = 0
	begin
	--*/
	declare @cid int = (select cid from users where uid=@uid)
	declare @sectionNo int

	--create quiz on first pass
	if (@quizid = 0) begin
		set nocount on
		insert into Quizzes(quizname, QuizType, CreatedBy, OwnerCID)
		select @quizname, case when @section='' then 'Standard' else 'StepByStep' end, @uid, @cid
		select @quizid = SCOPE_IDENTITY()
		set nocount off
	end

	--set default / will be changed at the end
	select @sectionNo = 1 where @sectionNo is null

	if @questionid = 0 begin
		set nocount on
		insert into QuizQuestions(question, Answer1, Answer2, Answer3, Answer4, CorrectAnswer, CreatedBy)
		select @question, @answer1, @answer2, @answer3, @answer4, @correct, @uid
		select @questionid = SCOPE_IDENTITY()
		set nocount off
	end

	if (@tags <> '')
		insert into QuestionTags(QuestionID, Tag, CreatedBy)
		select @questionid, val, @uid
		from selectConcat(@tags, ',')

	if (@material <> '')
		if (select id from QuizQuestionMaterial where QuizID=@quizid and SectionNo=@sectionNo) is null
			insert into QuizQuestionMaterial(QuizID, SectionNo, CreatedBy, URL, Explanation)
			select @quizid, @sectionNo, @uid, 
				case when @material like 'http%' then @material else null end,
				case when @material not like 'http%' then @material else null end

	insert into QuizBody(QuizID, SectionNo, SectionName, SortNo, QuestionID, createdby)
	select @quizid, @sectionNo, @section, @ix*100, @questionid, @uid

	create table #tmp(id int identity, sectionname varchar(1000))
	insert into #tmp(sectionname)
	select sectionname 
	from (
		select min(sortNo/100) sortno, sectionName from QuizBody where quizid=@quizid 
		group by SectionName
	) x order by sortno

	update b set SectionNo=x.id
	from QuizBody b
	join #tmp x on b.SectionName = x.SectionName
	where b.QuizID=@quizid


	select @quizid as QuizID
	drop table #tmp
end
GO
/****** Object:  StoredProcedure [dbo].[LC_UploadQuiz]    Script Date: 04/05/2022 19:09:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[LC_UploadQuiz]
	@uid int, @ix int, @quizname varchar(300), @question varchar(1000), 
	@answer1 varchar(1000), @answer2 varchar(1000), @answer3 varchar(1000), @answer4 varchar(1000), 
	@correct varchar(1000), @section varchar(1000), @material varchar(1000),@filename varchar(1000), @quizid int = 0
as begin
	/*
	declare @uid int=11, @ix int=0, 
		@quizname varchar(300) = 'FDCPA Exam',
		@tags varchar(8000) = 'FDCPA,JK1'
		@question varchar(300) = 'What information can you request from a third party? ',
		@answer1 varchar(300) = 'The consumer''s home address, home phone number and place of employment. ',
		@answer2 varchar(300) = 'The consumer''s home phone, work phone number and place of employment. ',
		@answer3 varchar(300) = 'The consumer''s home address, cell phone number and place of employment. ',
		@answer4 varchar(300) = 'The consumer''s home phone number, work phone number and cell phone number. ',
		@correct varchar(300) = '1',
		@section varchar(300) = 'Setion One',
		@material varchar(1000) = '',
		@quizid int = 0
	begin
	--*/
	declare @cid int = (select cid from users where uid=@uid)
	declare @questionid int, @sectionNo int
	declare @tags varchar(8000) = ''

	--create quiz on first pass
	if (@quizid = 0) begin
		set nocount on
		insert into Quizzes(quizname, QuizType, CreatedBy, OwnerCID)
		select @quizname, case when @section='' then 'Standard' else 'StepByStep' end, @uid, @cid
		select @quizid = SCOPE_IDENTITY()
		set nocount off
	end

	--set default / will be changed at the end
	select @sectionNo = 1 where @sectionNo is null

	set nocount on
	insert into QuizQuestions(question, Answer1, Answer2, Answer3, Answer4, CorrectAnswer, CreatedBy)
	select @question, @answer1, @answer2, @answer3, @answer4, @correct, @uid
	select @questionid = SCOPE_IDENTITY()
	set nocount off

	if (@tags <> '')
		insert into QuestionTags(QuestionID, Tag, CreatedBy)
		select @questionid, val, @uid
		from selectConcat(@tags, ',')
			
	insert into QuizBody(QuizID, SectionNo, SectionName, SortNo, QuestionID, createdby)
	select @quizid, @sectionNo, @section, @ix*100, @questionid, @uid

	select identity (int) id, sectionname 
	into #tmp
	from (
		select min(sortNo/100) sortno, sectionName from QuizBody where quizid=@quizid 
		group by SectionName
	) x order by sortno

	update b set SectionNo=x.id
	from QuizBody b
	join #tmp x on b.SectionName = x.SectionName
	where b.QuizID=@quizid

	select @sectionNo = max(SectionNo) from QuizBody where QuizID=@quizid

	if (@material <> '' and @filename<>'')
		begin
			if (select id from QuizQuestionMaterial where QuizID=@quizid and SectionNo=@sectionNo) is null
			insert into QuizQuestionMaterial(QuizID, SectionNo, CreatedBy, URL, Explanation,Filename)
			select @quizid, @sectionNo, @uid,case when @material like 'http%' then @material else null end,case when @material not like 'http%' then @material else null end,
			case when @filename<>'' then @filename else null end
		end
	if (@material = '' and @filename<>'')
		begin
			if (select id from QuizQuestionMaterial where QuizID=@quizid and SectionNo=@sectionNo) is null
			insert into QuizQuestionMaterial(QuizID, SectionNo, CreatedBy,Filename)
			select @quizid, @sectionNo, @uid,@filename
		end

	if (@material <> '' and @filename='')
		begin
			if (select id from QuizQuestionMaterial where QuizID=@quizid and SectionNo=@sectionNo) is null
			insert into QuizQuestionMaterial(QuizID, SectionNo, CreatedBy, URL, Explanation)
			select @quizid, @sectionNo, @uid,case when @material like 'http%' then @material else null end,case when @material not like 'http%' then @material else null end
			
		end
	
	select @quizid as QuizID
	drop table #tmp
end
GO
