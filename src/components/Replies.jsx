import PropTypes from "prop-types";

const Replies = ({ reply, relativeTime }) => {
  return (
    <section className="flex flex-col items-center px-10">
      <div className="flex items-center space-x-1">
        <p className="text-xs text-red-200">
          {reply.authorId === reply.replierId
            ? reply.replierName + " :Author"
            : reply.replierName}
        </p>
        <img
          src={
            reply.buffer && reply.mimetype
              ? `data:${reply.mimetype};base64,${reply.buffer}`
              : "/assets/images/unknown-user.jpg"
          }
          alt="user"
          className="w-5 h-5 rounded-full"
        />
      </div>
      <p className="text-sm">{reply.reply}</p>
      <p className="text-[10px] text-red-300 -mt-1.5">
        {relativeTime(reply.timeStamp)}
      </p>
    </section>
  );
};

Replies.propTypes = {
  reply: PropTypes.object,
  relativeTime: PropTypes.func,
};

export default Replies;
