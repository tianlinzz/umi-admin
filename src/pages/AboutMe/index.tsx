import { useSelector, useDispatch } from "umi";
import { Button, Card } from "antd";
import { useEffect } from "react";

export default function AboutMe() {
  const dispatch = useDispatch();
  const { myInfo } = useSelector((state: any) => state.aboutMeState);

  useEffect(() => {
    console.log("myInfo");
  }, [myInfo]);

  const handlerOnClick = () => {
    dispatch({
      type: "aboutMeState/save",
      payload: {
        myInfo: {
          name: "李四",
        },
      },
    });
  };

  return (
    <div className="flex flex-col items-center">
      <h2>AboutMe</h2>
      <Card>{myInfo.name}</Card>
      <Button onClick={handlerOnClick}>修改名字</Button>
    </div>
  );
}
